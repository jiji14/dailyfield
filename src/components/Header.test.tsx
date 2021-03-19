import { render, screen, waitFor, act } from "@testing-library/react";
import Header from "./Header";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  test("Sign In", async () => {
    const fakeUser = {} as firebase.User;
    let setUser: (user: firebase.User | null) => void = () => null;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: null,
      onAuthStateChanged: (callback: (user: firebase.User | null) => void) => {
        setUser = callback;
        callback(null);
      },
      signInWithPhoneNumber: jest.fn().mockResolvedValue({
        confirm: jest.fn(),
      }),
    });
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: true }),
        }),
      }),
    });
    // Fake constructor.
    firebase.auth.RecaptchaVerifier = jest.fn();
    window.prompt = () => "123456";
    window.alert = () => "";

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNIN");
    await act(async () => {
      if (setUser) setUser(fakeUser);
    });
    await fireAntEvent.actAndInput(
      "- 없이 숫자만 입력해주세요. (ex)01012345678",
      "01090143492"
    );

    await fireAntEvent.actAndClick("로그인");
    const phoneNumber = firebase.auth().signInWithPhoneNumber.mock.calls[0][0];
    expect(phoneNumber).toBe("+821090143492");
    const signoutButton = screen.getByText(/SIGNOUT/i);
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    const fakeUser = {} as firebase.User;
    let setUser: (user: firebase.User | null) => void = () => null;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      onAuthStateChanged: (callback: (user: firebase.User | null) => void) => {
        setUser = callback;
        callback(fakeUser);
      },
      currentUser: {},
      signOut: jest.fn(),
    });

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNOUT");
    await act(async () => {
      if (setUser) setUser(null);
    });
    const signoutButton = screen.getByText("SIGNIN");
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign In Status", async () => {
    const fakeUser = {} as firebase.User;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: (callback: (user: firebase.User) => void) => {
        callback(fakeUser);
      },
    });
    render(<Header />);
    await waitFor(async () => {
      const signoutButton = screen.getByText("SIGNOUT");
      expect(signoutButton).toBeInTheDocument();
    });
  });

  test("Sign Out Status", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      onAuthStateChanged: jest.fn(),
      currentUser: null,
    });

    render(<Header />);
    await waitFor(async () => {
      const signoutButton = screen.getByText("SIGNIN");
      expect(signoutButton).toBeInTheDocument();
    });
  });
});

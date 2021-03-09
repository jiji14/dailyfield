import { render, screen, waitFor } from "@testing-library/react";
import Header from "./Header";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  test("Sign In", async () => {
    const fakeUser = {} as firebase.User;
    let isSignInButtonClicked = false;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: null,
      onAuthStateChanged: (callback: (user: firebase.User | null) => void) => {
        callback(isSignInButtonClicked ? fakeUser : null);
      },
      signInWithPhoneNumber: jest.fn().mockResolvedValue({
        confirm: jest.fn().mockResolvedValue({
          additionalUserInfo: { isNewUser: false },
        }),
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
    await fireAntEvent.actAndInput(
      "- 없이 숫자만 입력해주세요. (ex)01012345678",
      "01090143492"
    );

    await fireAntEvent.actAndClick("로그인");
    isSignInButtonClicked = true;
    const phoneNumber = firebase.auth().signInWithPhoneNumber.mock.calls[0][0];
    expect(phoneNumber).toBe("+821090143492");
    const signoutButton = screen.getByText(/SIGNOUT/i);
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    const fakeUser = null;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      onAuthStateChanged: jest.fn(),
      currentUser: {},
      signOut: jest.fn().mockResolvedValue({
        onAuthStateChanged: (callback: (user: null) => void) => {
          callback(fakeUser);
        },
      }),
    });

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNOUT");
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

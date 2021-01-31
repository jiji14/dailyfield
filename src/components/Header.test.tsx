import { render, screen, waitFor } from "@testing-library/react";
import Header from "./Header";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  test("Sign In", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: null,
      onAuthStateChanged: () => "",
      signInWithPhoneNumber: jest.fn().mockResolvedValue({
        confirm: jest.fn().mockResolvedValue({
          additionalUserInfo: { isNewUser: false },
          user: {},
        }),
      }),
    });
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: {} }),
        }),
      }),
    });
    // Fake constructor.
    firebase.auth.RecaptchaVerifier = jest.fn();
    window.prompt = () => "123456";
    window.alert = () => "";

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNIN");
    await fireAntEvent.actAndInput("핸드폰번호", "+1 650-555-3434");
    const signinButton = screen.getByText(/로그인/i);
    expect(signinButton).toBeInTheDocument();

    await fireAntEvent.actAndClick("로그인");
    const signoutButton = screen.getByText(/SIGNOUT/i);
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      onAuthStateChanged: () => "",
      currentUser: {},
      signOut: jest.fn().mockResolvedValue(null),
    });

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNOUT");
    const signoutButton = screen.getByText("SIGNIN");
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign In Status", async () => {
    const fakeUser = {};
    const callback = jest.fn();
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      onAuthStateChanged: (callback) => {
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
      onAuthStateChanged: () => "",
    });

    render(<Header />);
    await waitFor(async () => {
      const signoutButton = screen.getByText("SIGNIN");
      expect(signoutButton).toBeInTheDocument();
    });
  });
});

import { render, screen } from "@testing-library/react";
import Header from "./Header";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  test("Sign In", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: null,
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
    const phoneNumber = firebase.auth().signInWithPhoneNumber.mock.calls[0][0];
    expect(phoneNumber).toBe("+821090143492");
    const signoutButton = screen.getByText(/SIGNOUT/i);
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      signOut: jest.fn().mockResolvedValue(null),
    });

    render(<Header />);
    await fireAntEvent.actAndClick("SIGNOUT");
    const signoutButton = screen.getByText("SIGNIN");
    expect(signoutButton).toBeInTheDocument();
  });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import Header from "./Header";
import firebase from "firebase";

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
        where: jest.fn().mockReturnValue({
          get: jest
            .fn()
            .mockResolvedValue([{ data: jest.fn().mockReturnValue({}) }]),
        }),
      }),
    });
    // Fake constructor.
    firebase.auth.RecaptchaVerifier = jest.fn();
    window.prompt = () => "123456";
    window.alert = () => "";

    render(<Header />);

    fireEvent.click(screen.getByText("SIGNIN"));

    const input = screen.getByPlaceholderText("핸드폰번호");
    fireEvent.change(input, { target: { value: "+1 650-555-3434" } });

    const signinButton = screen.getByText(/로그인/i);
    expect(signinButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(/로그인/i));
    });

    const signoutButton = screen.getByText(/SIGNOUT/i);
    expect(signoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      signOut: jest.fn().mockResolvedValue(null),
    });

    render(<Header />);

    await act(async () => {
      fireEvent.click(screen.getByText("SIGNOUT"));
    });

    const signoutButton = screen.getByText("SIGNIN");
    expect(signoutButton).toBeInTheDocument();
  });
});

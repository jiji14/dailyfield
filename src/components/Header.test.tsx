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
    // Fake constructor.
    firebase.auth.RecaptchaVerifier = jest.fn();
    window.prompt = () => "123456";

    render(<Header />);

    fireEvent.click(screen.getByText("LOGIN"));

    const input = screen.getByPlaceholderText("핸드폰번호");
    fireEvent.change(input, { target: { value: "+1 650-555-3434" } });

    const button = screen.getByText(/로그인/i);
    expect(button).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(button);
    });

    const logoutButton = screen.getByText("LOGOUT");
    await expect(logoutButton).toBeInTheDocument();
  });

  test("Sign Out", async () => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      signOut: jest.fn().mockResolvedValue(null),
    });

    render(<Header />);

    await act(async () => {
      fireEvent.click(screen.getByText("LOGOUT"));
    });

    const logoutButton = screen.getByText("LOGIN");
    await expect(logoutButton).toBeInTheDocument();
  });
});

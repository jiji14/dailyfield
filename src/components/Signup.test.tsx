import { render, screen } from "@testing-library/react";
import { matchMediaSetup } from "../jestSetup";
import App from "../App";

describe("Test", () => {
  beforeAll(() => {
    matchMediaSetup();
  });

  test("renders Signup", () => {
    render(<App />);
    const button = screen.getByText(/가입하기/i);
    expect(button).toBeInTheDocument();
  });
});

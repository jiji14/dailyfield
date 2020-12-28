import { render, screen } from "@testing-library/react";
import { matchMediaSetup } from "../setupTests";
import Signup from "./Signup";

describe("Test", () => {
  beforeAll(() => {
    matchMediaSetup();
  });

  test("renders Signup", () => {
    render(<Signup />);
    const button = screen.getByText(/가입하기/i);
    expect(button).toBeInTheDocument();
  });
});

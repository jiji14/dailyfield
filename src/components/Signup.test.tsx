import { render, screen } from "@testing-library/react";
import Signup from "./Signup";

describe("Test", () => {
  test("renders Signup", () => {
    render(<Signup />);
    const button = screen.getByText(/가입하기/i);
    expect(button).toBeInTheDocument();
  });
});

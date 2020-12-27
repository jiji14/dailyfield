import { render, screen } from "@testing-library/react";
import { matchMediaSetup } from "./jestSetup";
import App from "./App";

describe("Test", () => {
  beforeAll(() => {
    matchMediaSetup();
  });

  test("renders MatchLists", () => {
    render(<App />);
    const label = screen.getByText(/신청가능/i);
    expect(label).toBeInTheDocument();
  });

  test("renders PlayerLists", () => {
    render(<App />);
    const button = screen.getByText(/신청승인/i);
    expect(button).toBeInTheDocument();
  });
});

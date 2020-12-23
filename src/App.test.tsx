import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MatchLists", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => {
        return {
          matches: true,
          addListener: jest.fn(),
          removeListener: jest.fn()
        };
      })
    });
  });

  render(<App />);
  const linkElement = screen.getByText(/신청가능/i);
  expect(linkElement).toBeInTheDocument();
});

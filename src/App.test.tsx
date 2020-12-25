import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Test", () => {
  beforeAll(() => {
    global.matchMedia =
      global.matchMedia ||
      function () {
        return {
          matches: true,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };
  });

  test("renders MatchLists", () => {
    render(<App />);
    const label = screen.getByText(/신청가능/i);
    expect(label).toBeInTheDocument();
  });
});

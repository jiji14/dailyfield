import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/신청가능/i);
  expect(linkElement).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import Admin from "./Admin";

describe("Test", () => {
  test("Admin Page", async () => {
    render(<Admin />);
    expect(screen.getByText("관리자페이지")).toBeInTheDocument();
  });
});

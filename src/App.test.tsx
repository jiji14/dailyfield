import { render, screen } from "@testing-library/react";
import App from "./App";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });
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

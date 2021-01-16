import { render, screen } from "@testing-library/react";
import Main from "./Main";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });
  });

  test("renders Main", () => {
    render(<Main />);
    const label = screen.getByText(/매치목록/i);
    expect(label).toBeInTheDocument();
  });
});

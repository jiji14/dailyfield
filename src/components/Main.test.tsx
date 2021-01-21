import { render, screen } from "@testing-library/react";
import Main from "./Main";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({}),
        }),
      }),
    });
  });

  test("renders Main", () => {
    render(<Main />);
    const label = screen.getByText(/매치목록/i);
    expect(label).toBeInTheDocument();
  });
});

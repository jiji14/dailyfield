import { render, screen, waitFor } from "@testing-library/react";
import Admin from "./Admin";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockImplementation(() => {
              return {
                dateTime: {
                  toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
                },
                place: "용산 더베이스",
                memberCount: 15,
                teamCount: 3,
                gender: "여성",
                level: "초급",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                canRentShoes: true,
                manager: "이지정",
              };
            }),
            id: "test12345",
          }),
        }),
      }),
    });
  });

  test("Admin Page", async () => {
    render(<Admin />);
    await waitFor(async () => {
      expect(screen.getByDisplayValue("이지정")).toBeInTheDocument();
      expect(screen.getByText("수정하기")).toBeInTheDocument();
      expect(screen.getByText("삭제하기")).toBeInTheDocument();
    });
  });
});

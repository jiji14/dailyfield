import { render, screen, waitFor } from "@testing-library/react";
import MatchDetail from "./MatchDetail";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: {},
            data: jest.fn().mockReturnValue({
              dateTime: { toDate: jest.fn().mockReturnValue(new Date()) },
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
              manager: "배성진",
            }),
            id: "test12345",
          }),
        }),
      }),
    });
  });

  test("renders MatchDetail", async () => {
    render(<MatchDetail />);

    await waitFor(async () => {
      //더미데이터 제대로 나오는지 확인
      expect(screen.getByText(/초급레벨/i)).toBeInTheDocument();
      expect(screen.getByText(/풋살화 대여 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/주차 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/20,000원/i)).toBeInTheDocument();
    });
  });
});

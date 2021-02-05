import { render, screen, waitFor } from "@testing-library/react";
import MatchList from "./MatchList";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            docs: [
              {
                data: jest.fn().mockReturnValue({
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
                  manager: "배성진",
                }),
                id: "test12345",
              },
            ],
          }),
        }),
      }),
    });
  });

  test("renders Matches", async () => {
    render(<MatchList />);
    await waitFor(async () => {
      expect(screen.getByText(/용산 더베이스/i)).toBeInTheDocument();
      expect(screen.getByText(/15명/i)).toBeInTheDocument();
      expect(screen.getByText(/여성/i)).toBeInTheDocument();
      expect(screen.getByText(/초급/i)).toBeInTheDocument();
      //jsdom toLocaleDateString issue - https://github.com/jsdom/jsdom/issues/1489
      //jest 테스트환경 브라우저에서는 toLocaleDateString(ko-KR) 지원하지 않아서 테스트에서 영어로 확인해야됨.
      expect(screen.getByText("Friday, 1/1/2021")).toBeInTheDocument();
    });
    await fireAntEvent.actAndClick("신청가능");
    expect(useHistory().push.mock.calls[0][0]).toBe("/match/test12345");
  });
});

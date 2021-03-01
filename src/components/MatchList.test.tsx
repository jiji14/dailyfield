import { render, screen, waitFor } from "@testing-library/react";
import MatchList from "./MatchList";
import firebase from "firebase";

describe("Test", () => {
  beforeEach(() => {
    const fakeUser = {} as firebase.User;
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: (callback: (user: firebase.User) => void) => {
        callback(fakeUser);
      },
    });

    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockReturnValue({
              isAdmin: true,
            }),
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 10,
              }),
            }),
            doc: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                exists: {},
                data: jest.fn().mockReturnValue({
                  status: "확정",
                }),
              }),
            }),
          }),
        }),
        orderBy: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              docs: [
                {
                  data: jest.fn().mockReturnValue({
                    dateTime: {
                      toDate: jest.fn().mockReturnValue(new Date("2021-12-01")),
                    },
                    place: "용산 더베이스",
                    memberCount: 15,
                    gender: "여성",
                    link: "www.naver.com",
                    gameType: "match",
                    fee: 20000,
                    canPark: true,
                    manager: "배성진",
                  }),
                  id: "test12345",
                },
              ],
            }),
          }),
        }),
      }),
    });
  });

  test("renders Matches", async () => {
    render(<MatchList />);
    await waitFor(async () => {
      expect(screen.getByText(/용산 더베이스/i)).toBeInTheDocument();
      expect(screen.getByText(/여성/i)).toBeInTheDocument();
      //jsdom toLocaleDateString issue - https://github.com/jsdom/jsdom/issues/1489
      //jest 테스트환경 브라우저에서는 toLocaleDateString(ko-KR) 지원하지 않아서 테스트에서 영어로 확인해야됨.
      expect(screen.getByText("Wednesday, 12/1/2021")).toBeInTheDocument();
    });
    expect(screen.getByText(/예약확정/i)).toBeInTheDocument();
  });

  test("check AddMatch Button", async () => {
    render(<MatchList />);
    await waitFor(async () => {
      expect(screen.getByText(/매치등록/i)).toBeInTheDocument();
    });
  });
});

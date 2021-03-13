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
  });

  test("renders Matches - 일반", async () => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockReturnValue({
              isAdmin: true, //관리자인지 확인
            }),
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 10, // 신청중인 선수 몇명인지 확인
              }),
            }),
            doc: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                exists: {},
                data: jest.fn().mockReturnValue({
                  status: "확정", //나의 예약상태 확인
                }),
              }),
            }),
          }),
        }),
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                docs: [
                  // 매치 정보 가져오기
                  {
                    data: jest.fn().mockReturnValue({
                      dateTime: {
                        toDate: jest
                          .fn()
                          .mockReturnValue(new Date("2021-12-01")),
                      },
                      place: "용산 더베이스",
                      memberCount: 15,
                      gender: "여성",
                      link: "www.naver.com",
                      gameType: "match",
                      fee: 20000,
                      canPark: true,
                      manager: "배성진",
                      isRecurringClass: false,
                    }),
                    id: "test12345",
                  },
                ],
              }),
            }),
          }),
        }),
      }),
    });

    render(<MatchList recurringClasses={false} />);
    await waitFor(async () => {
      expect(screen.getByText(/용산 더베이스/i)).toBeInTheDocument();
      expect(screen.getByText(/여성/i)).toBeInTheDocument();
      //jsdom toLocaleDateString issue - https://github.com/jsdom/jsdom/issues/1489
      //jest 테스트환경 브라우저에서는 toLocaleDateString(ko-KR) 지원하지 않아서 테스트에서 영어로 확인해야됨.
      expect(screen.getByText("Wednesday, 12/1")).toBeInTheDocument();
    });
    expect(screen.getByText(/예약확정/i)).toBeInTheDocument();
    expect(screen.getByText(/매치등록/i)).toBeInTheDocument(); //어드민일때 매치등록 버튼 보이는지 확인
    expect(
      firebase.firestore().collection().where().where
    ).toHaveBeenCalledWith("isRecurringClass", "==", false);
  });

  test("renders Matches - 기획반", async () => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockReturnValue({
              isAdmin: false, //관리자인지 확인
            }),
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 10, // 신청중인 선수 몇명인지 확인
              }),
            }),
            doc: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                exists: {},
                data: jest.fn(), //나의 예약상태 확인
              }),
            }),
          }),
        }),
        where: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                docs: [
                  // 매치 정보 가져오기 s
                  {
                    data: jest.fn().mockReturnValue({
                      dateTime: {
                        toDate: jest
                          .fn()
                          .mockReturnValue(new Date("2021-12-01")),
                      },
                      place: "신사 누리",
                      memberCount: 15,
                      gender: "혼성원팀",
                      link: "www.naver.com",
                      gameType: "match",
                      fee: 20000,
                      canPark: true,
                      manager: "배성진",
                      isRecurringClass: true,
                    }),
                    id: "test12345",
                  },
                ],
              }),
            }),
          }),
        }),
      }),
    });

    render(<MatchList recurringClasses />);
    await waitFor(async () => {
      //recurringClasses 일때 다른정보 제대로 나오는지 확인
      expect(screen.getByText(/신사 누리/i)).toBeInTheDocument();
      expect(screen.getByText(/혼성원팀/i)).toBeInTheDocument();
      expect(screen.getByText(/신청가능/i)).toBeInTheDocument();
      expect(
        firebase.firestore().collection().where().where
      ).toHaveBeenCalledWith("isRecurringClass", "==", true);
    });
  });
});

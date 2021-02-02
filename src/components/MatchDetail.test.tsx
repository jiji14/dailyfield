import { render, screen, waitFor } from "@testing-library/react";
import MatchDetail from "./MatchDetail";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  beforeEach(() => {
    const fakeUser = {};
    const callback = jest.fn();
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: (callback) => {
        callback(fakeUser);
      },
    });
  });

  test("예약중인 경우", async () => {
    await ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: {},
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
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 5,
              }),
            }),
            doc: jest.fn().mockReturnValue({
              set: jest.fn().mockResolvedValue(null),
              get: jest.fn().mockResolvedValue({
                exists: {},
                data: jest.fn().mockReturnValue({
                  status: "pending",
                }),
              }),
            }),
          }),
        }),
      }),
    });
    render(<MatchDetail />);

    await waitFor(async () => {
      //더미데이터 제대로 나오는지 확인
      expect(screen.getByText(/초급레벨/i)).toBeInTheDocument();
      expect(screen.getByText(/풋살화 대여 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/주차 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/20,000원/i)).toBeInTheDocument();
      expect(screen.getByText("신청중")).toBeInTheDocument();
      expect(screen.getByText("예약취소")).toBeInTheDocument();
    });

    window.alert = () => "";
    window.confirm = () => "";
    window.location = { reload: jest.fn() };

    await fireAntEvent.actAndClick("예약취소");
    const match = firebase
      .firestore()
      .collection("matches")
      .doc("id")
      .collection("reservation")
      .doc("uid").set.mock.calls;
  });

  test("예약 마감", async () => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: {},
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
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 15,
              }),
            }),
            doc: jest.fn().mockReturnValue({
              set: jest.fn().mockResolvedValue(null),
              get: jest.fn().mockResolvedValue({
                exists: null,
              }),
            }),
          }),
        }),
      }),
    });
    render(<MatchDetail />);

    await waitFor(async () => {
      //더미데이터 제대로 나오는지 확인
      expect(screen.getByText(/초급레벨/i)).toBeInTheDocument();
      expect(screen.getByText(/풋살화 대여 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/주차 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/20,000원/i)).toBeInTheDocument();
      expect(screen.getByText("마감")).toBeInTheDocument();
    });
  });

  test("예약 가능 - 예약하기", async () => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: {},
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
          }),
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                size: 10,
              }),
            }),
            doc: jest.fn().mockReturnValue({
              set: jest.fn().mockResolvedValue(null),
              get: jest.fn().mockResolvedValue({
                exists: null,
              }),
            }),
          }),
        }),
      }),
    });

    window.alert = () => "";
    window.confirm = () => "";
    window.location = { reload: jest.fn() };

    render(<MatchDetail />);

    await waitFor(async () => {
      //더미데이터 제대로 나오는지 확인
      expect(screen.getByText(/초급레벨/i)).toBeInTheDocument();
      expect(screen.getByText(/풋살화 대여 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/주차 가능/i)).toBeInTheDocument();
      expect(screen.getByText(/20,000원/i)).toBeInTheDocument();
      expect(screen.getByText("신청가능")).toBeInTheDocument();
    });
    await fireAntEvent.actAndClick("예약하기");
    const match = firebase
      .firestore()
      .collection("matches")
      .doc("id")
      .collection("reservation")
      .doc("uid").set.mock.calls;
  });
});

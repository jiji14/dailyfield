import { render, screen, waitFor } from "@testing-library/react";
import MatchDetail from "./MatchDetail";
import firebase from "firebase";
import { fireAntEvent } from "../setupTests";

describe("Test", () => {
  beforeEach(() => {
    ((firebase.auth as unknown) as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: jest.fn(),
    });
  });

  test("예약 신청중인경우 신청중이고 예약취소 버튼 보이는지 테스트", async () => {
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
                memberCount: 150,
                teamCount: 3,
                gender: "여성",
                level: "초급",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                canRentShoes: true,
                manager: "배성진",
              };
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
              delete: jest.fn().mockResolvedValue(null),
              get: jest.fn().mockResolvedValue({
                exists: {},
                data: jest.fn().mockReturnValue({
                  status: "예약신청",
                }),
              }),
            }),
          }),
        }),
      }),
    });
    render(<MatchDetail />);

    await waitFor(async () => {
      expect(screen.getByText("신청중")).toBeInTheDocument(); // 예약이 신청중인지 확인
      expect(screen.getByText("예약취소")).toBeInTheDocument(); // 신청중이면 예약취소가 보여야함
    });

    window.alert = () => "";
    window.confirm = () => "";
    window.location = { reload: jest.fn() };
    await fireAntEvent.actAndClick("예약취소");
  });

  test("예약이 선수 다 차서 마감이면 마감인지 테스트", async () => {
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
                manager: "배성진",
              };
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
      expect(screen.getByText("마감")).toBeInTheDocument(); //예약이 마감인지 확인
    });
  });

  test("예약 가능한 상태이면 예약하기 테스트", async () => {
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
                manager: "배성진",
              };
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
                exists: false,
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
      expect(screen.getByText("신청가능")).toBeInTheDocument(); //예약이 신청가능인지 확인
      expect(screen.getByText("예약하기")).toBeInTheDocument(); // 신청가능이면 예약하기가 보여야함
    });
    await fireAntEvent.actAndClick("예약하기");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import MatchDetail from "./MatchDetail";
import firebase from "firebase";
import { fireAntEvent, mockWindowLocationReload } from "../setupTests";
import { useParams } from "react-router-dom";
import { updateReservationStatus } from "../globalFunction";

describe("Test", () => {
  beforeEach(() => {
    const fakeUser = { uid: "user123" } as firebase.User;
    (firebase.auth as unknown as jest.Mock).mockReturnValue({
      currentUser: {},
      onAuthStateChanged: (callback: (user: firebase.User) => void) => {
        callback(fakeUser);
      },
    });
  });

  test("예약중인경우 신청중이고 예약취소 버튼 보이는지 테스트", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
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
                memberType: "여성",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                manager: "배성진",
              };
            }),
            id: "match123",
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
                  status: "확정",
                }),
              }),
            }),
          }),
        }),
      }),
    });
    useParams.mockReturnValue({ id: "match123" });
    render(<MatchDetail />);

    await waitFor(async () => {
      expect(screen.getByText("예약확정")).toBeInTheDocument(); // 예약이 신청중인지 확인
      expect(screen.getByText("예약취소")).toBeInTheDocument(); // 신청중이면 예약취소가 보여야함
    });

    window.alert = () => "";
    window.confirm = () => true;
    mockWindowLocationReload();

    await fireAntEvent.actAndClick("예약취소");
    // 예약 상태 업데이트하는 updateReservationStatus 파라미터 확인, status가 "취소신청"으로 들어왔는지 확인
    expect(updateReservationStatus).toHaveBeenCalledWith(
      "match123",
      "user123",
      "취소신청"
    );
    // 예약 상태 업데이트하는 updateReservationStatus 1번 호출됐는지 확인
    expect(updateReservationStatus).toHaveBeenCalledTimes(1);
  });

  test("예약이 선수 다 차서 마감이면 마감인지 테스트", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockImplementation(() => {
              return {
                dateTime: {
                  toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
                },
                place: "신사 누리",
                memberCount: 15,
                memberType: "여성",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                manager: "배성진",
                parkingGuidelines: "# 주차테스트",
              };
            }),
            id: "match123",
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
    useParams.mockReturnValue({ id: "match123" });
    render(<MatchDetail />);

    await waitFor(async () => {
      expect(screen.getByText("마감")).toBeInTheDocument(); //예약이 마감인지 확인
      expect(screen.getByText("주차테스트")).toBeInTheDocument(); //주차 확인
    });
  });

  test("예약 가능한 상태이면 예약하기 테스트", async () => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
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
                memberType: "여성",
                link: "www.naver.com",
                gameType: "match",
                fee: 20000,
                canPark: true,
                manager: "배성진",
              };
            }),
            id: "match123",
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
    window.confirm = () => true;
    mockWindowLocationReload();
    useParams.mockReturnValue({ id: "match123" });
    render(<MatchDetail />);

    await waitFor(async () => {
      expect(screen.getByText("신청가능")).toBeInTheDocument(); //예약이 신청가능인지 확인
      expect(screen.getByText("예약하기")).toBeInTheDocument(); // 신청가능이면 예약하기가 보여야함
    });
    await fireAntEvent.actAndClick("예약하기");
    // 예약 상태 업데이트하는 updateReservationStatus 파라미터 확인, status가 "예약신청"으로 들어왔는지 확인
    expect(updateReservationStatus).toHaveBeenCalledWith(
      "match123",
      "user123",
      "예약신청"
    );
    // 예약 상태 업데이트하는 updateReservationStatus 1번 호출됐는지 확인
    expect(updateReservationStatus).toHaveBeenCalledTimes(1);
  });
});

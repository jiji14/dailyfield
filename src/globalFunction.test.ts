import firebase from "firebase";
import { Match } from "./types";
import {
  isMatchFull,
  getMatchStatusForUser,
  getReservationStatus,
} from "./globalFunction";

describe("Test", () => {
  beforeEach(() => {
    (firebase.firestore as unknown as jest.Mock).mockReturnValue({
      // matches collection
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          // reservation collection
          collection: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              // reservation data size
              get: jest.fn().mockResolvedValue({
                size: 10,
              }),
            }),
            doc: jest.fn().mockReturnValue({
              get: jest.fn().mockResolvedValue({
                // match - reservation에 user가 있는지 확인
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
  });

  test("isMatchFull Test - 매치가 full인지 확인", async () => {
    const match = {
      id: "test12345",
      memberCount: 10,
    } as Match;
    const isFull = await isMatchFull(match);
    expect(isFull).toBeTruthy();
  });

  test("isMatchFull Test - 매치가 full이 아닌지 확인", async () => {
    const match = {
      id: "test12345",
      memberCount: 11,
    } as Match;
    const isFull = await isMatchFull(match);
    expect(isFull).toBeFalsy();
  });

  test("getMatchStatusForUser Test - 유저 예약상태가 확정인지 확인", async () => {
    const match = {
      id: "test12345",
    } as Match;
    const uid = "test12345";
    const reservationStatus = await getMatchStatusForUser(match, uid);
    expect(reservationStatus).toBe("확정");
  });

  test("getReservationStatus Test - match, user null 값인 경우 상태가 신청가능인지 확인", async () => {
    const reservationStatus = await getReservationStatus(null, null);
    expect(reservationStatus).toBe("신청가능");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import firebase from "firebase";
import PlayerListItem from "./PlayerListItem";
import { mockWindowLocationReload, fireAntEvent } from "../setupTests";
import { CollectionName } from "../collections";
/* eslint @typescript-eslint/no-var-requires: "off" */
const globalFunction = require("../globalFunction");

describe("Test", () => {
  beforeEach(() => {
    ((firebase.firestore as unknown) as jest.Mock).mockReturnValue({
      // users collection, 유저정보 데이터
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: jest.fn().mockImplementation(() => {
              return {
                isAdmin: true,
                birthDate: {
                  toDate: jest.fn().mockReturnValue(new Date("2021-01-01")),
                },
                name: "이지정",
                phoneNumber: "+821090143492",
                matchesPlayed: 1,
                purpose: [],
              };
            }),
            id: "test12345",
          }),
          update: jest.fn().mockReturnValue(null),
          // matches -> reservation collection, 해당 매치에 대한 예약상태 데이터
          collection: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              docs: [
                {
                  data: jest.fn().mockReturnValue({
                    status: "예약신청",
                  }),
                  id: "test12345",
                },
              ],
            }),
            doc: jest.fn().mockReturnValue({
              set: jest.fn().mockResolvedValue(null),
              delete: jest.fn().mockReturnValue(null),
            }),
          }),
        }),
      }),
    });
    window.alert = () => "";
    window.confirm = () => true;
    mockWindowLocationReload();
  });

  test("관리자 예약신청 승인", async () => {
    firebase.firestore.FieldValue.increment = jest.fn().mockReturnValue(2);
    render(
      <PlayerListItem
        matchId="match123"
        playerId="player123"
        status="예약신청"
      />
    );
    await waitFor(async () => {
      //상태가 예약신청일때 신청승인 버튼 나오는지 확인
      expect(screen.getByText("신청승인")).toBeInTheDocument();
    });
    await fireAntEvent.actAndClick("신청승인");
    const user = firebase
      .firestore()
      .collection(CollectionName.usersCollectionName)
      .doc("id").update.mock.calls[0][0];
    expect(user.matchesPlayed).toBe(2); // 매치가 2번으로 증가했는지 확인
    const status = firebase
      .firestore()
      .collection(CollectionName.usersCollectionName)
      .doc("matchId")
      .collection(CollectionName.reservationsCollectionName)
      .doc("uid").set.mock.calls[0][0];
    expect(status.status).toBe("확정"); // 예약상태가 확정으로 바뀌었는지 확인
  });
  test("관리자 취소신청 승인", async () => {
    firebase.firestore.FieldValue.increment = jest.fn().mockReturnValue(0);
    render(
      <PlayerListItem
        matchId="match123"
        playerId="player123"
        status="취소신청"
      />
    );
    await waitFor(async () => {
      //상태가 취소신청일때 취소승인 버튼 나오는지 확인
      expect(screen.getByText("취소승인")).toBeInTheDocument();
    });
    await fireAntEvent.actAndClick("취소승인");

    const user = firebase
      .firestore()
      .collection(CollectionName.usersCollectionName)
      .doc("id").update.mock.calls[0][0];
    expect(user.matchesPlayed).toBe(0); // 매치가 0번으로 감소했는지 확인

    const spy = jest.spyOn(globalFunction, "deleteReservationStatus");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

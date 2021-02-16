import React, { useState, useEffect } from "react";
import { Row, Col, Divider, Button } from "antd";
import "antd/dist/antd.css";
import "./PlayerListItem.css";
import firebase from "firebase";
import { Player, Status } from "../types";
import { CollectionName } from "../collections";
import { deleteReservationStatus } from "../globalFunction";

const PlayerListItem = (playerProps: {
  matchId: string;
  playerId: string;
  status: string;
}): JSX.Element => {
  const { matchId, playerId, status } = playerProps;
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    (async () => {
      const db = firebase.firestore();
      const doc = await db
        .collection(CollectionName.usersCollectionName)
        .doc(playerId)
        .get();
      if (!doc.exists) return;

      const user = doc.data();
      if (!user) return;

      user.birthDate = user.birthDate.toDate();
      user.id = doc.id;
      user.status = status;
      setPlayer(user as Player);
    })();
  }, [playerId, status]);

  const internationalToLocalKoreanPhoneNumber = (phoneNumber: string) => {
    return "0" + phoneNumber.substring(3, phoneNumber.length);
  };

  const confirmRequest = (status: Status | undefined) => {
    switch (status) {
      case "예약신청":
        confirmReservation();
        return;
      case "취소신청":
        confirmCancel();
        return;
      default:
        return;
    }
  };

  const confirmReservation = async () => {
    const confirmReservation = window.confirm("예약신청을 승인하시겠습니까?");
    if (!confirmReservation) return;
    const db = firebase.firestore();
    await db
      .collection(CollectionName.matchesCollectionName)
      .doc(matchId)
      .collection(CollectionName.reservationsCollectionName)
      .doc(playerId)
      .set({ status: "확정" });
    setMatchesPlayed(true, "예약신청이 확정되었습니다.");
  };

  const confirmCancel = async () => {
    const confirmCancel = window.confirm("취소신청을 승인하시겠습니까?");
    if (!confirmCancel) return;
    await deleteReservationStatus(matchId, playerId);
    setMatchesPlayed(false, "취소신청이 확정되었습니다.");
  };

  const setMatchesPlayed = async (
    isMatchesPlayedUp: boolean,
    confirmMessage: string
  ) => {
    const db = firebase.firestore();
    await db
      .collection(CollectionName.usersCollectionName)
      .doc(playerId)
      .update({
        matchesPlayed: firebase.firestore.FieldValue.increment(
          isMatchesPlayedUp ? 1 : -1
        ),
      });

    window.alert(confirmMessage);
    window.location.reload();
  };

  return player ? (
    <>
      <Row align="middle">
        <Col span={4} className="playerContainer">
          <div className="playerName">{player.name}</div>
        </Col>
        <Col span={4} className="playerContainer">
          <div>{player.gender}</div>
        </Col>
        <Col span={8}>
          {internationalToLocalKoreanPhoneNumber(player.phoneNumber)}
        </Col>
        <Col span={8} className="buttonContainer">
          {player.status !== "확정" && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                confirmRequest(player.status);
              }}
            >
              {player.status === "예약신청" ? "신청승인" : "취소승인"}
            </Button>
          )}
          <Button size="small">
            {player.status === "확정" ? "확정취소" : "거절"}
          </Button>
        </Col>
      </Row>
      <Row className="playerDetail">
        {player.matchesPlayed}번 참여 / {player.status}중 입니다.
      </Row>
      <Divider className="divider" />
    </>
  ) : (
    <></>
  );
};

export default PlayerListItem;

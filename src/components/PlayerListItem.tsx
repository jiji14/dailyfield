import React, { useState, useEffect } from "react";
import { Row, Col, Divider, Button } from "antd";
import "antd/dist/antd.css";
import "./PlayerListItem.css";
import firebase from "firebase";
import { Player } from "../types";

const PlayerListItem = (playerProps: {
  id: string;
  status: string;
}): JSX.Element => {
  const { id, status } = playerProps;
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    (async () => {
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(id).get();
      if (!doc.exists) return;

      const user = doc.data();
      if (!user) return;

      user.birthDate = user.birthDate.toDate();
      user.id = doc.id;
      user.status = status;
      setPlayer(user as Player);
    })();
  }, [id, status]);

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
          {"0" + player.phoneNumber.substring(3, player.phoneNumber.length)}
        </Col>
        <Col span={8} className="buttonContainer">
          {player.status !== "확정" && (
            <Button type="primary" size="small">
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

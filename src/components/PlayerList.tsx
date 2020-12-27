import React from "react";
import { Row, Col, Divider, Button } from "antd";
import "antd/dist/antd.css";
import "./PlayerList.css";
import { Player } from "../types";

const player: Player = {
  id: 1,
  name: "이지정",
  gender: "여성",
  phoneNumber: "010-9014-3492",
  matchesPlayed: 10,
  status: "예약신청",
};

const PlayerList = (): JSX.Element => {
  return (
    <>
      <Row align="middle">
        <Col span={8} className="playerContainer">
          <div className="playerName">{player.name}</div>
          <div>{player.gender}</div>
        </Col>
        <Col span={8}>{player.phoneNumber}</Col>
        <Col span={8} className="buttonContainer">
          {player.status !== "확정" && (
            <Button type="primary" size="small">
              {player.status === "예약신청" ? "신청승인" : "취소승인"}
            </Button>
          )}
          <Button size="small">
            {player.status === "확정" ? "거절" : "강퇴"}
          </Button>
        </Col>
      </Row>
      <Row className="playerDetail">
        {player.matchesPlayed}번 참여 / {player.status}중 입니다.
      </Row>
      <Divider className="divider" />
    </>
  );
};

export default PlayerList;

import React from "react";
import { Row, Col, Divider } from "antd";
import Label from "./Label";
import "antd/dist/antd.css";
import "./MatchList.css";
import { Match } from "../types";

const match: Match = {
  id: 1,
  dateTime: new Date(),
  place: "용산 더베이스",
  memberCount: 15,
  teamCount: 3,
  gender: "여성",
  level: "초급",
  link: "naver.com",
  gameType: "gx",
  fee: 20000,
  canPark: true,
  canRentShoes: false,
  manager: "배성진",
};

const MatchList = (): JSX.Element => {
  return (
    <>
      <Row align="middle">
        <Col span={6}>
          <div className="time">
            {match.dateTime.getHours()}:{match.dateTime.getMinutes()}
          </div>
        </Col>
        <Col span={12}>
          <div className="place">{match.place}</div>
          <div className="infoContainer">
            <div className="info">{match.gender}</div>
            <div className="info">{match.memberCount}명</div>
            <div className="info">{match.level}</div>
          </div>
        </Col>
        <Col span={6} className="alignRight">
          <Label type="primary">신청가능</Label>
        </Col>
      </Row>
      <Divider className="divider" />
    </>
  );
};

export default MatchList;

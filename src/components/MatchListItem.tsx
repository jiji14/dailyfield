import React, { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import Label from "./Label";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match } from "../types";

const MatchListItem = (matchProps: { match: Match }): JSX.Element => {
  const { match } = matchProps;

  return (
    match && (
      <>
        <Row align="middle">
          <Col span={6}>
            <div className="time">
              {match.dateTime && match.dateTime.getHours()}:
              {match.dateTime && match.dateTime.getMinutes()}
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
    )
  );
};

export default MatchListItem;

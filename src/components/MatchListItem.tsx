import React, { useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import Label from "./Label";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match, Status } from "../types";
import { Link } from "react-router-dom";
import firebase from "firebase";

const MatchListItem = (matchProps: {
  match: Match;
  isAdmin: boolean;
}): JSX.Element => {
  const { match, isAdmin } = matchProps;
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [reservationStatus, setReservationStatus] = useState<Status>(
    "신청가능"
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    async function getMatchStatus() {
      if (match) {
        const db = firebase.firestore();
        const matchDoc = await db
          .collection("matches")
          .doc(match.id)
          .collection("reservation")
          .where("status", "==", "확정")
          .get();

        if (matchDoc?.size >= match.memberCount) {
          setReservationStatus("마감");
        }

        if (!user) return;

        const reservationDoc = await db
          .collection("matches")
          .doc(match.id)
          .collection("reservation")
          .doc(user.uid)
          .get();

        if (reservationDoc.exists) {
          const data = reservationDoc.data();
          if (data?.status) {
            setReservationStatus(data.status);
          }
        }
      }
    }
    getMatchStatus();
  }, [match, user]);

  const renderReservationStatus = () => {
    switch (reservationStatus) {
      case "신청가능":
        return <Label type="primary">신청가능</Label>;
      case "예약신청":
        return <Label type="progress">신청중</Label>;
      case "마감":
        return <Label type="secondary">마감</Label>;
      case "확정":
        return <Label type="success">예약확정</Label>;
      case "취소신청":
        return <Label type="progress">취소중</Label>;
      default:
        return null;
    }
  };

  return (
    match && (
      <Link to={isAdmin ? `/match/${match.id}/admin` : `/match/${match.id}`}>
        <Row align="middle">
          <Col span={6}>
            <div className="time">
              {match.dateTime?.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
            <Label type="primary">{renderReservationStatus()}</Label>
          </Col>
        </Row>
        <Divider className="divider" />
      </Link>
    )
  );
};

export default MatchListItem;

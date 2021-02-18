import React, { useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match, Status } from "../types";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { getReservationStatus } from "../globalFunction";
import ReservationStatus from "./ReservationStatus";

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
    (async () => {
      setReservationStatus(await getReservationStatus(match, user));
    })();
  }, [match, user]);

  return (
    match && (
      <Link to={isAdmin ? `/match/${match.id}/admin` : `/match/${match.id}`}>
        <Row align="middle">
          <Col span={8}>
            <div className="time">
              {match.dateTime?.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </Col>
          <Col span={10}>
            <div className="place">{match.place}</div>
            <div className="infoContainer">
              <div className="info">{match.gender}</div>
            </div>
          </Col>
          <Col span={6} className="alignRight">
            <ReservationStatus reservationStatus={reservationStatus} />
          </Col>
        </Row>
        <Divider className="divider" />
      </Link>
    )
  );
};

export default MatchListItem;

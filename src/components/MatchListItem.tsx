import React, { useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match, Status } from "../types";
import { Link } from "react-router-dom";
import { getReservationStatus } from "../globalFunction";
import ReservationStatus from "./ReservationStatus";
import { useUser } from "../customHooks/useUser";

const MatchListItem = (matchProps: {
  match: Match;
  isAdmin: boolean;
}): JSX.Element => {
  const { match, isAdmin } = matchProps;
  const [reservationStatus, setReservationStatus] = useState<Status>(
    "신청가능"
  );
  const user = useUser();

  useEffect(() => {
    (async () => {
      setReservationStatus(await getReservationStatus(match, user));
    })();
  }, [match, user]);

  return (
    match && (
      <Link to={isAdmin ? `/match/${match.id}/admin` : `/match/${match.id}`}>
        <Row align="middle">
          <Col span={6}>
            <div className="time">
              {match.dateTime?.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                hour12: false,
                minute: "2-digit",
              })}
              {/* 클라이언트 긴급요청으로 인한 하드코딩, 해당 기간 후 코드 삭제 예정 */}
              {match.id === "NCFFseorszSs7BHc5EJb" && " / 12:00"}
            </div>
          </Col>
          <Col span={12}>
            <div className="infoTitle">{match.title}</div>
            <div className="infoContainer">
              <div className="info">{match.gender}</div>
              {match.isRecurringClass && (
                <div className="info highlight">{match.place}</div>
              )}
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

import { Row, Col, Divider } from "antd";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match } from "../types";
import { Link } from "react-router-dom";

import ReservationStatus from "./ReservationStatus";
import { useUser } from "../customHooks/useUser";
import { useReservationStatus } from "../customHooks/useReservationStatus";

const MatchListItem = (matchProps: {
  match: Match;
  isAdmin: boolean;
}): JSX.Element => {
  const { match, isAdmin } = matchProps;
  const user = useUser();
  const reservationStatus = useReservationStatus(match, user);

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

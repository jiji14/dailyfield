import { Row, Col, Divider } from "antd";
import Label from "./Label";
import "antd/dist/antd.css";
import "./MatchListItem.css";
import { Match } from "../types";
import { useHistory } from "react-router-dom";

const MatchListItem = (matchProps: { match: Match }): JSX.Element => {
  const { match } = matchProps;
  const history = useHistory();

  return (
    match && (
      <>
        <Row
          align="middle"
          onClick={() => {
            history.push(`/match/${match.id}`);
          }}
        >
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
            <Label type="primary">신청가능</Label>
          </Col>
        </Row>
        <Divider className="divider" />
      </>
    )
  );
};

export default MatchListItem;

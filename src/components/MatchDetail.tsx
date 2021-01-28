import React from "react";
import { Row, Divider, Button } from "antd";
import "antd/dist/antd.css";
import "./MatchDetail.css";
import { Match } from "../types";
import Label from "./Label";
import { useHistory } from "react-router-dom";

const match: Match = {
  dateTime: new Date(),
  place: "용산",
  memberCount: 15,
  teamCount: 3,
  gender: "여성",
  level: "초급",
  link: "www.naver.com",
  gameType: "gx+match",
  fee: 20000,
  canPark: true,
  canRentShoes: false,
  manager: "배성진",
};

const MatchDetail = (): JSX.Element => {
  const history = useHistory();

  return (
    <div className="matchDetail">
      <h4
        onClick={() => {
          history.push("/");
        }}
      >
        목록으로 돌아가기
      </h4>
      <Divider className="divider" />
      <section>
        <Row align="middle" className="container Row">
          <div>{match.dateTime?.toDateString()}</div>
          <Label type="progress">마감</Label>
        </Row>
        <Row align="middle" className="container Row">
          <div>{match.place}</div>
          <a href={match.link} target="__blank">
            구장 정보보기
          </a>
        </Row>
        <Row align="middle" className="container">
          <div className="card">{match.gender}매치</div>
          <div className="card">
            최대 {match.memberCount}명 ({match.teamCount}파전)
          </div>
          <div className="card">{match.level}레벨</div>
        </Row>
        <Row align="middle" className="container">
          <div className="card">{match.gameType}</div>
          <div className="card">
            풋살화 대여 {match.canRentShoes ? "가능" : "불가능"}
          </div>
          <div className="card">주차 {match.canPark ? "가능" : "불가능"}</div>
        </Row>
        <Row align="middle" className="container Row">
          * 여성매치시 인원부족시 혼성매치로 진행됩니다.
        </Row>
        <Row align="middle" className="container Row">
          <div>
            <div className="title">참가비</div>
            <div>
              {match.fee.toLocaleString()}원 (첫참석시{" "}
              {(match.fee / 2).toLocaleString()}원)
            </div>
          </div>
          <div>
            <div className="title">매니저</div>
            <div>{match.manager}</div>
          </div>
        </Row>
        <Row align="middle" className="Row">
          <div className="flex">
            <div className="title">매치 안내</div>
            <div className="details">
              <h4>준비물</h4>
              <div>** 신발 복장은 편한것으로 준비</div>
              <div>** 열정적이고 열린 마음 준비</div>
            </div>
            <div className="details">
              <h4>프로그램 안내</h4>
              <div>** 스타일 : GX 프로그램(30분) + 매치(1시간 30분)</div>
              <div>
                ** GX프로그램은 데일리필드만의 차별화된 진행 방식입니다.
                인트로에 짧게 프로그램을 진행함으로써,
              </div>
              <div>
                1. 초급분들께는 풋살에 필요한 기본 스킬을 익힐수 있는 방향을
                제시해 드려요!
              </div>
              <div>
                2. 혼자 또는 친구분들과 참석해도 어색하지 않아요! 처음보는
                팀원들과 친해지고 소통할수 있는 기회를 제공합니다.
              </div>
              <div>
                3. 준비된 몸과 마음을 매치 플레이에 적극적으로 펼치세요!^^
              </div>
            </div>
          </div>
        </Row>
        <Row align="middle" className="Row">
          <div className="flex">
            <div className="title">예약 안내</div>
            <div className="details">
              <div>
                1. 언제까지 예약 가능한지 : 최대인원 {match.memberCount}명
                모집시
              </div>
              <div>
                2. 언제까지 예약취소 가능한지 : 서비스의 질을 고려하여
                당일취소는 환급이 어렵습니다.
              </div>
              <div>[ 하루전 취소시 50% 환급 ]</div>
              <div>[ 2일전 취소시 : 100% 환급 ]</div>
              <div>** 상대방을 배려하는 측면에서 참고해주시면 감사합니다.</div>
              <div>
                ** 기타 자연재해 등으로 인한 운영불가 시 100% 환급 드립니다.
              </div>
              <div>
                ** 최소인원 미달시 매치취소 안내와 함께 참가비를 전액
                환급드립니다.
              </div>
            </div>
          </div>
        </Row>
        <Row align="middle" className="Row">
          <div className="flex">
            <div className="title">입금 절차</div>
            <div className="details">
              <div>
                ** 예약하기 버튼 클릭 후 아래계좌로 참가비를 입금해주시면 매니저
                확인 후 예약확정이 됩니다.
              </div>
              <div>[ 국민은행 472501-04-011482 배성진 ]</div>
            </div>
          </div>
        </Row>
        <Row align="middle" className="Row">
          <div className="details">
            <div>축구도 이제 고급스포츠!</div>
            <div>혼자와도 재밌게 운동하자! </div>
            <div>새로운 커뮤니티의 시작♡ 데일리필드⚽</div>
            <br />
            <div>📌인스타팔로우 @daily_field</div>
            <div>📌블로그♡ blog.naver.com/piterq</div>
            <div>📌스페셜 영상 youtu.be/08zp7lrtOpc</div>
          </div>
        </Row>
      </section>
      <Divider className="divider" />
      <div className="signUpButtonContainer">
        <Button type="primary">예약하기</Button>
      </div>
    </div>
  );
};

export default MatchDetail;

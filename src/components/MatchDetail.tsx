import React, { useState, useEffect } from "react";
import { Divider, Button, Tag } from "antd";
import "antd/dist/antd.css";
import "./MatchDetail.css";
import { Match, Status } from "../types";
import Label from "./Label";
import { useHistory, useParams } from "react-router-dom";
import firebase from "firebase";

const MatchDetail = (): JSX.Element => {
  const history = useHistory();
  const [match, setMatch] = useState<Match | null>(null);
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [reservationStatus, setReservationStatus] = useState<Status>(
    "신청가능"
  );
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    async function getMatch() {
      const db = firebase.firestore();
      const doc = await db.collection("matches").doc(id).get();
      if (!doc.exists) {
        window.alert("잘못된 접근입니다. 목록페이지로 돌아갑니다.");
        history.push("/");
        return;
      }

      const match = doc.data();

      if (match) {
        match.dateTime = match.dateTime.toDate();
        match.id = doc.id;
        setMatch(match as Match);

        const matchDoc = await db
          .collection("matches")
          .doc(match.id)
          .collection("reservation")
          .where("status", "==", "done")
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
    getMatch();
  }, [history, id, user]);

  const reserveMatch = async () => {
    if (!user) {
      window.alert("예약은 로그인 후에 가능합니다.");
      return;
    }

    if (window.confirm("해당 매치를 예약신청하시겠습니까?")) {
      const { uid } = user;
      const db = firebase.firestore();
      await db
        .collection("matches")
        .doc(match?.id)
        .collection("reservation")
        .doc(uid)
        .set({ status: "예약신청" });

      window.alert(
        "예약신청이 완료되었습니다. 참가비 입금 확인 후 예약이 확정됩니다."
      );
      window.location.reload();
    }
  };

  const cancelMatch = async () => {
    if (!user) {
      window.alert("예약취소는 로그인 후에 가능합니다.");
      return;
    }
    if (window.confirm("예약취소를 진행하시겠습니까?")) {
      const { uid } = user;
      const db = firebase.firestore();
      if (reservationStatus === "예약신청") {
        await db
          .collection("matches")
          .doc(match?.id)
          .collection("reservation")
          .doc(uid)
          .delete();
        window.alert("예약취소가 완료되었습니다.");
      } else {
        await db
          .collection("matches")
          .doc(match?.id)
          .collection("reservation")
          .doc(uid)
          .set({ status: "취소신청" });
        window.alert(
          "취소신청이 완료되었습니다. 환불 규정에 따라 환불 처리가 진행된 후 취소가 확정됩니다."
        );
      }
      window.location.reload();
    }
  };

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

  const renderButton = () => {
    switch (reservationStatus) {
      case "신청가능":
        return (
          <Button type="primary" onClick={reserveMatch}>
            예약하기
          </Button>
        );
      case "확정":
        return (
          <Button type="primary" onClick={cancelMatch}>
            예약취소
          </Button>
        );
      case "예약신청":
        return (
          <Button type="primary" onClick={cancelMatch}>
            예약취소
          </Button>
        );
      default:
        return null;
    }
  };

  return !match ? (
    <div></div>
  ) : (
    <div className="matchDetail">
      <a href="/">목록으로 돌아가기</a>
      <Divider className="divider" />
      <div className="container">
        <div>
          {match.dateTime?.toLocaleDateString("ko-KR", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
        {renderReservationStatus()}
      </div>
      <div className="container">
        <div>{match.place}</div>
        <a href={match.link} target="_blank" rel="noreferrer">
          구장 정보보기
        </a>
      </div>
      <div className="tagContainer">
        <Tag color="warning" className="chip">
          {match.gender}매치
        </Tag>
        <Tag color="warning" className="chip">
          최대 {match.memberCount}명 ({match.teamCount}파전)
        </Tag>
        <Tag color="warning" className="chip">
          {match.level}레벨
        </Tag>
        <Tag color="warning" className="chip">
          {match.gameType}
        </Tag>
        <Tag color="warning" className="chip">
          풋살화 대여 {match.canRentShoes ? "가능" : "불가능"}
        </Tag>
        <Tag color="warning" className="chip">
          주차 {match.canPark ? "가능" : "불가능"}
        </Tag>
      </div>
      <p className="details">* 여성매치시 인원부족시 혼성매치로 진행됩니다.</p>
      <section>
        <h3 className="title">참가비</h3>
        <p className="details">
          {match.fee.toLocaleString()}원 (첫참석시{" "}
          {(match.fee / 2).toLocaleString()}원)
        </p>
        <h3 className="title">매니저</h3>
        <p className="details">{match.manager}</p>
        <h3 className="title">매치 안내</h3>
        <h4>준비물</h4>
        <ul>
          <li>신발 복장은 편한것으로 준비</li>
          <li>열정적이고 열린 마음 준비</li>
        </ul>
        <h4>프로그램 안내</h4>
        <ul>
          <li>스타일 : GX 프로그램(30분) + 매치(1시간 30분)</li>
          <li>
            GX프로그램은 데일리필드만의 차별화된 진행 방식입니다. 인트로에 짧게
            프로그램을 진행함으로써,
          </li>
        </ul>
        <ol>
          <li>
            초급분들께는 풋살에 필요한 기본 스킬을 익힐수 있는 방향을 제시해
            드려요!
          </li>
          <li>
            혼자 또는 친구분들과 참석해도 어색하지 않아요! 처음보는 팀원들과
            친해지고 소통할수 있는 기회를 제공합니다.
          </li>
          <li>준비된 몸과 마음을 매치 플레이에 적극적으로 펼치세요!^^</li>
        </ol>
        <h3 className="title">예약 안내</h3>
        <ol>
          <li>
            언제까지 예약 가능한지 : 최대인원 {match.memberCount}명 모집시
          </li>
          <li>
            언제까지 예약취소 가능한지 : 서비스의 질을 고려하여 당일취소는
            환급이 어렵습니다.
          </li>
          <li className="subLi">
            <ul>
              <li>하루전 취소시 50% 환급</li>
              <li>2일전 취소시 : 100% 환급</li>
            </ul>
          </li>
        </ol>
        <ul>
          <li>상대방을 배려하는 측면에서 참고해주시면 감사합니다.</li>
          <li>기타 자연재해 등으로 인한 운영불가 시 100% 환급 드립니다.</li>
          <li>
            최소인원 미달시 매치취소 안내와 함께 참가비를 전액 환급드립니다.
          </li>
        </ul>
        <h3 className="title">입금 절차</h3>
        <ul>
          <li>
            예약하기 버튼 클릭 후 아래계좌로 참가비를 입금해주시면 매니저 확인
            후 예약확정이 됩니다.
          </li>
          <li>국민은행 472501-04-011482 배성진</li>
        </ul>
        <ul className="iconUl">
          <li>축구도 이제 고급스포츠! 혼자와도 재밌게 운동하자!</li>
          <li>새로운 커뮤니티의 시작♡ 데일리필드⚽</li>
          <li>인스타팔로우 @daily_field</li>
          <li>블로그♡ blog.naver.com/piterq</li>
          <li>스페셜 영상 youtu.be/08zp7lrtOpc</li>
        </ul>
      </section>
      <Divider className="divider" />
      <div className="signUpButtonContainer">{renderButton()}</div>
    </div>
  );
};

export default MatchDetail;

import React, { useState, useEffect } from "react";
import { Divider, Button, Tag } from "antd";
import "antd/dist/antd.css";
import "./MatchDetail.css";
import { Match } from "../types";
import { useHistory, useParams } from "react-router-dom";
import firebase from "firebase";
import {
  deleteReservationStatus,
  updateReservationStatus,
} from "../globalFunction";
import ReservationStatus from "./ReservationStatus";
import { CollectionName } from "../collections";
import { useUser } from "../customHooks/useUser";
import ReactMarkdown from "react-markdown";
import { useReservationStatus } from "../customHooks/useReservationStatus";

const MatchDetail = (): JSX.Element | null => {
  const history = useHistory();
  const [match, setMatch] = useState<Match | null>(null);
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const reservationStatus = useReservationStatus(match, user);

  useEffect(() => {
    (async () => {
      const db = firebase.firestore();
      const doc = await db
        .collection(CollectionName.matchesCollectionName)
        .doc(id)
        .get();
      if (!doc.exists) {
        window.alert("잘못된 접근입니다. 목록페이지로 돌아갑니다.");
        history.push("/");
        return;
      }

      const match = doc.data();
      if (!match) return;
      match.dateTime = match.dateTime.toDate();
      match.id = doc.id;
      setMatch(match as Match);
    })();
  }, [history, id, user]);

  const reserveMatch = async () => {
    if (!user) {
      window.alert("예약은 로그인 후에 가능합니다.");
      return;
    }

    if (!match?.id) return;
    if (window.confirm("해당 매치를 예약신청하시겠습니까?")) {
      const { uid } = user;
      await updateReservationStatus(match.id, uid, "예약신청");
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
    if (!match?.id) return;
    if (window.confirm("예약취소를 진행하시겠습니까?")) {
      const { uid } = user;
      if (reservationStatus === "예약신청") {
        await deleteReservationStatus(match.id, uid);
        window.alert("예약취소가 완료되었습니다.");
      } else {
        await updateReservationStatus(match.id, uid, "취소신청");
        window.alert(
          "취소신청이 완료되었습니다. 환불 규정에 따라 환불 처리가 진행된 후 취소가 확정됩니다."
        );
      }
      window.location.reload();
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

  const renderPark = () => {
    if (match?.place.includes("더베이스")) {
      return (
        <ul>
          <li>해주차장 선착순 2명</li>
          <li>예약신청 후 직접 문의주세요.</li>
        </ul>
      );
    } else if (match?.place.includes("누리")) {
      return (
        <ul>
          <li>입구 주차장 사용가능 (무료)</li>
          <li>건물 뒷편 주차장 사용 가능 (3대 이상 무료)</li>
          <li>세화빌딩 지하주차 (무료)</li>
          <li>(2~3대 가능/단 SUV불가,일반세단 및 경차만 가능)</li>
          <li>평양면옥 발렛주차(30분 2,000원)</li>
        </ul>
      );
    } else {
      return <p>직접 문의 해주세요.</p>;
    }
  };

  const renderCancelPolicy = () => {
    if (match?.isRecurringClass) {
      return (
        <ol>
          <li>
            언제까지 예약 가능한지 : 최대인원 {match?.memberCount}명 모집시
          </li>
          <li>환불 : 해당 일정 내 부상시 환불적용</li>
        </ol>
      );
    } else {
      return (
        <>
          <ol>
            <li>
              언제까지 예약 가능한지 : 최대인원 {match?.memberCount}명 모집시
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
        </>
      );
    }
  };

  if (!match) return null;

  return (
    <>
      <div className="container">
        <div className="dateContainer">
          {match.dateTime?.toLocaleString("ko-KR", {
            weekday: "long",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
          })}
        </div>
        <ReservationStatus reservationStatus={reservationStatus} />
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
          {match.gameType.toUpperCase()}
        </Tag>
        <Tag color="warning" className="chip">
          주차 {match.canPark ? "가능" : "불가능"}
        </Tag>
      </div>
      {match.gender === "여성" && (
        <p className="details">
          * 여성매치시 인원부족시 혼성매치로 진행됩니다.
        </p>
      )}
      <section>
        <h3 className="title">참가비</h3>
        <p className="details">{match.fee.toLocaleString()}원</p>
        <h3 className="title">매니저</h3>
        <p className="details">{match.manager}</p>
        <h3 className="title">매치 안내</h3>
        {<ReactMarkdown>{match.guideline}</ReactMarkdown>}
        <h3 className="title">예약 안내</h3>
        {renderCancelPolicy()}
        <h3 className="title">참가 방법</h3>
        <ul>
          <li>아래 계좌로 참가비 입금후, 하단 예약하기 클릭!</li>
          <li>국민은행 472501-04-011482 배성진</li>
        </ul>
        {match.canPark && (
          <>
            <h3 className="title">주차 안내</h3>
            {renderPark()}
          </>
        )}
        <h3 className="UlTitle">[운동 사진 & 영상 미리보기]</h3>
        <ul className="iconUl">
          <li>인스타 : @daily_field</li>
          <li>블로그 : blog.naver.com/piterq</li>
          <li>유튜브 : 데일리필드 검색</li>
        </ul>
      </section>
      <Divider className="divider" />
      <div className="signUpButtonContainer">{renderButton()}</div>
    </>
  );
};

export default MatchDetail;

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";
import { Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { CollectionName } from "../collections";
import { useUser } from "../customHooks/useUser";

const MatchList = (props: { recurringClasses?: boolean }): JSX.Element => {
  const { recurringClasses } = props;
  const [dateKeyToMatches, setDateKeyToMatches] = useState<
    Map<string, Match[]>
  >(new Map());
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useUser();

  useEffect(() => {
    async function getMatches() {
      const db = firebase.firestore();
      const eventEndDateKey = recurringClasses ? "endDate" : "dateTime";
      const querySnapshot = await db
        .collection(CollectionName.matchesCollectionName)
        .where(eventEndDateKey, ">=", new Date())
        .where("isRecurringClass", "==", recurringClasses)
        .orderBy(eventEndDateKey, "asc")
        .get();

      const dateKeyToMatches: Map<string, Match[]> = new Map();
      const queryArray = recurringClasses //filter with an inequality 에러로 인하여 기획반일때 dateTime으로 한번더 소팅해주기
        ? querySnapshot.docs.sort(
            (
              prevData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
              nextData: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
            ) => {
              return prevData.data().dateTime - nextData.data().dateTime;
            }
          )
        : querySnapshot.docs;

      queryArray.forEach((doc) => {
        const data = doc.data();
        data.dateTime = data.dateTime.toDate();
        data.id = doc.id;
        const options = {
          weekday: "long",
          month: "numeric",
          day: "numeric",
        };
        const matchDate = data.dateTime.toLocaleDateString("ko-KR", options);
        if (!dateKeyToMatches.has(matchDate))
          dateKeyToMatches.set(matchDate, []);
        dateKeyToMatches.get(matchDate)?.push(data as Match);
      });
      setDateKeyToMatches(dateKeyToMatches);
    }

    getMatches();
  }, [recurringClasses]);

  useEffect(() => {
    async function getUser() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const db = firebase.firestore();
      const doc = await db
        .collection(CollectionName.usersCollectionName)
        .doc(user.uid)
        .get();
      if (doc.exists) setIsAdmin(doc.data()?.isAdmin);
    }

    getUser();
  }, [user]);

  const renderMatchList = () => {
    return [...dateKeyToMatches].map(([dateKey, matches]) => {
      return (
        <div key={dateKey}>
          <div className="dateTitle">
            {dateKey}
            {/* 클라이언트 긴급요청으로 인한 하드코딩, 해당 기간 후 코드 삭제 예정 */}
            {dateKey === "5. 5. 수요일" && " / 5. 8. 토요일"}
          </div>
          {matches.map((match, idx) => {
            return (
              <MatchListItem
                match={match}
                key={"match" + idx}
                isAdmin={isAdmin}
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <>
      <div className="matchlistTitle">
        <h2>매치목록</h2>
        {isAdmin && (
          <Link to="/match/add">
            <Button type="primary">매치등록</Button>
          </Link>
        )}
      </div>
      {dateKeyToMatches.size > 0 ? (
        <section className="matchListContainer">{renderMatchList()}</section>
      ) : (
        <section className="loadingContainer">
          <Spin size="large" />
        </section>
      )}
    </>
  );
};

export default MatchList;

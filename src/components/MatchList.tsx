import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";

const MatchList = (): JSX.Element => {
  const [dateKeyToMatches, setDateKeyToMatches] = useState<
    Map<string, Match[]>
  >(new Map());

  useEffect(() => {
    async function getMatches() {
      const db = firebase.firestore();
      const querySnapshot = await db
        .collection("matches")
        .orderBy("dateTime", "desc")
        .get();

      const dateKeyToMatches: Map<string, Match[]> = new Map();

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        data.dateTime = data.dateTime.toDate();
        data.id = doc.id;
        const options = {
          weekday: "long",
          year: "numeric",
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
  }, []);

  const renderMatchList = () => {
    return [...dateKeyToMatches].map(([dateKey, matches]) => {
      return (
        <div key={dateKey}>
          <div className="dateTitle">{dateKey}</div>
          {matches.map((match, idx) => {
            return <MatchListItem match={match} key={"match" + idx} />;
          })}
        </div>
      );
    });
  };

  return (
    <div className="matchList">
      <h2>매치목록</h2>
      <section className="matchListContainer">{renderMatchList()}</section>
    </div>
  );
};

export default MatchList;

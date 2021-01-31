import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";

const MatchList = (): JSX.Element => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchDate, setMatchDate] = useState<string[]>([]);

  useEffect(() => {
    async function getMatches() {
      const db = firebase.firestore();
      const querySnapshot = await db
        .collection("matches")
        .orderBy("dateTime", "desc")
        .get();

      const matchDateArray: Array<string> = [];
      const matches: Match[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        data.dateTime = data.dateTime.toDate();
        const options = {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const matchDate = data.dateTime.toLocaleDateString("ko-KR", options);
        matchDateArray.push(matchDate);
        data.id = doc.id;
        return data as Match;
      });
      setMatchDate(matchDateArray);
      setMatches(matches);
    }
    getMatches();
  }, []);

  return (
    <div className="matchList">
      <h2>매치목록</h2>
      <section className="matchListContainer">
        {matches.map((match, idx) => {
          if (matchDate[idx] !== matchDate[idx - 1]) {
            return (
              <div key={"match" + idx}>
                <div className="dateTitle">{matchDate[idx]}</div>
                <MatchListItem match={match} />
              </div>
            );
          } else {
            return <MatchListItem key={"match" + idx} match={match} />;
          }
        })}
      </section>
    </div>
  );
};

export default MatchList;

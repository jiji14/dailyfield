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
        const matchDate = data.dateTime.toLocaleDateString("ko-KR");
        const dayOfWeek = getDayOfWeek(data.dateTime.getDay());
        matchDateArray.push(matchDate + " " + dayOfWeek);
        data.id = doc.id;
        return data as Match;
      });
      setMatchDate(matchDateArray);
      setMatches(matches);
    }
    getMatches();
  }, []);

  const getDayOfWeek = (dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 1:
        return "월요일";
      case 2:
        return "화요일";
      case 3:
        return "수요일";
      case 4:
        return "목요일";
      case 5:
        return "금요일";
      case 6:
        return "토요일";
      case 0:
        return "일요일";
      default:
        return null;
    }
  };

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

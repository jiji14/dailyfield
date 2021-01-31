import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import { Divider } from "antd";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";

const Main = (): JSX.Element => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchDate, setMatchDate] = useState<string[]>([]);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("matches")
      .orderBy("dateTime", "desc")
      .get();

    const matchDateArray: Array<string> = [];
    const matches: Match[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      data.dateTime = data.dateTime.toDate();
      const day = data.dateTime.getDate();
      const month = data.dateTime.getMonth() + 1;
      const year = data.dateTime.getFullYear();
      const dayOfWeek = getDayOfWeek(data.dateTime.getDay());
      matchDateArray.push(year + "-" + month + "-" + day + " " + dayOfWeek);
      data.id = doc.id;
      return data as Match;
    });
    setMatchDate(matchDateArray);
    setMatches(matches);
  };

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
              <div>
                <div className="dateTitle">{matchDate[idx]}</div>
                <MatchListItem key={"match" + idx} match={match} />
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

export default Main;

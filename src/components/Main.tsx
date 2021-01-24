import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./Main.css";
import { Divider } from "antd";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";

const Main = (): JSX.Element => {
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("matches")
      .orderBy("dateTime", "desc")
      .get();
    const matches: Match[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      data.dateTime = data.dateTime.toDate();
      return data as Match;
    });
    setMatches(matches);
  };

  return (
    <div className="signUp">
      <h2>매치목록</h2>
      <Divider className="divider" />
      <section className="signUpContainer">
        {matches.map((match, idx) => {
          return <MatchListItem key={"match" + idx} match={match} />;
        })}
      </section>
    </div>
  );
};

export default Main;

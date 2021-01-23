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
    const lists = [] as Match[];
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("matches")
      .orderBy("dateTime", "desc")
      .get();
    querySnapshot.forEach(function (doc) {
      const tempDate = doc.data();
      if (tempDate?.dateTime) {
        const date = new Date(tempDate?.dateTime.seconds);
        tempDate["dateTime"] = date;
      }
      lists.push(tempDate as Match);
    });
    setMatches(lists);
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

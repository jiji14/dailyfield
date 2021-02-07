import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";
import { Button } from "antd";
import { useHistory } from "react-router-dom";

const MatchList = (): JSX.Element => {
  const history = useHistory();
  const [dateKeyToMatches, setDateKeyToMatches] = useState<
    Map<string, Match[]>
  >(new Map());
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

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

    async function getUser(uid: string) {
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(uid).get();
      if (doc.exists) setIsAdmin(doc.data()?.isAdmin);
    }

    getMatches();
  }, []);

  useEffect(() => {
    async function getUser() {
      if (!user) return;

      const db = firebase.firestore();
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) setIsAdmin(doc.data()?.isAdmin);
    }

    getUser();
  }, [user]);

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
      <div className="matchlistTitle">
        <h2>매치목록</h2>
        {isAdmin && (
          <Button
            type="primary"
            onClick={() => {
              history.push("/match/add");
            }}
          >
            매치등록
          </Button>
        )}
      </div>
      <section className="matchListContainer">{renderMatchList()}</section>
    </div>
  );
};

export default MatchList;

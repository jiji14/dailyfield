import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./MatchList.css";
import { Divider, Button } from "antd";
import firebase from "firebase";
import MatchListItem from "./MatchListItem";
import { Match } from "../types";
import { useHistory } from "react-router-dom";

const Main = (): JSX.Element => {
  const history = useHistory();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getUser(uid: string) {
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(uid).get();
      if (doc.exists) setIsAdmin(doc.data()?.isAdmin);
    }
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        getUser(user.uid);
      }
    });
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
      data.id = doc.id;
      return data as Match;
    });
    setMatches(matches);
  };

  return (
    <div className="matchList">
      <div className="matchTitleContainer">
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
      <Divider className="divider" />
      <section className="matchListContainer">
        {matches.map((match, idx) => {
          return <MatchListItem key={"match" + idx} match={match} />;
        })}
      </section>
    </div>
  );
};

export default Main;

import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./Admin.css";
import firebase from "firebase";
import { Divider } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";
import PlayerList from "./PlayerList";

const Admin = (): JSX.Element => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [players, setPlayers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        if (!doc.data()?.isAdmin) {
          window.alert("관리자로 로그인해주세요.");
          history.push("/");
          return;
        }
      }
    })();
  }, [user, history]);

  useEffect(() => {
    (async () => {
      const db = firebase.firestore();
      const querySnapshot = await db
        .collection("matches")
        .doc(id)
        .collection("reservation")
        .get();
      const players: Map<string, string> = new Map();
      querySnapshot.docs.forEach((doc) => {
        const id = doc.id;
        const status = doc.data().status;
        players.set(id, status);
      });
      setPlayers(players);
    })();
  }, [id]);

  const renderPlayerlists = () => {
    return [...players].map(([playerKey, status]) => {
      return <PlayerList key={playerKey} id={playerKey} status={status} />;
    });
  };

  return (
    <div className="admin">
      <Link to="/">목록으로 돌아가기</Link>
      <Divider className="divider" />
      <h2>회원목록</h2>
      <section className="playerListContainer">
        {players.size > 0 ? (
          renderPlayerlists()
        ) : (
          <div>현재 예약중인 회원이 없습니다.</div>
        )}
      </section>
    </div>
  );
};

export default Admin;

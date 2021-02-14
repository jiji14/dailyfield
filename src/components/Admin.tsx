import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./Admin.css";
import firebase from "firebase";
import { Divider } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";
import PlayerListItem from "./PlayerListItem";
import AddMatch from "./AddMatch";
      
const Admin = (): JSX.Element => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [idToPlayers, setIdToPlayers] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && !doc.data()?.isAdmin) {
        window.alert("관리자로 로그인해주세요.");
        history.push("/");
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
      const idToPlayers: Map<string, string> = new Map(
        querySnapshot.docs.map((doc) => {
          const { id } = doc;
          const { status } = doc.data();
          return [id, status];
        })
      );
      setIdToPlayers(idToPlayers);
    })();
  }, [id]);

  const renderPlayers = () => {
    return [...idToPlayers].map(([playerKey, status]) => {
      return <PlayerListItem key={playerKey} id={playerKey} status={status} />;
    });
  };

  return (
    <div className="admin">
      <Link to="/">목록으로 돌아가기</Link>
      <Divider className="divider" />
      <h2>회원목록</h2>
      <section className="playerListContainer">
        {idToPlayers.size > 0 ? (
          renderPlayers()
        ) : (
          <div>현재 예약중인 회원이 없습니다.</div>
        )}
      </section>
      <AddMatch id={id} />
    </div>
  );
};

export default Admin;

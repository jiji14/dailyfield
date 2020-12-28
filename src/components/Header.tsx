import React from "react";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import "./Header.css";
import firebase from "firebase";
import { Player } from "../types";

const signInWithPhoneNumber = () => {
  const appVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
    size: "invisible",
    callback: function (response: unknown) {
      console.log(response);
    },
    "expired-callback": function () {
      console.log("failed");
    },
  });

  const phoneNumber = "+821090143492";
  firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      const code = window.prompt("코드를 입력해주세요.") || "";
      confirmationResult.confirm(code).then(function (result) {
        const user = result.user;
        const signInUser: Player = {
          name: "이지정",
          gender: "여성",
          phoneNumber: user ? user.phoneNumber || "" : "",
          birthDate: new Date("1992-01-14"),
          matchesPlayed: 0,
        };
        const db = firebase.firestore();
        db.collection("users")
          .doc(user ? user.uid || "" : "")
          .set({
            signInUser,
          });
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

const Header = (): JSX.Element => {
  return (
    <div className="headerContainer">
      <Row className="menubar">
        <Col span={8} className="logo">
          DAILY FIELD
        </Col>
        <Col span={8} className="menu">
          <div className="menuFirstItem selectedMenu">MATCH</div>
          <div>ABOUT</div>
        </Col>
        <Col span={4}></Col>
        <Col span={4} className="login">
          <button onClick={signInWithPhoneNumber} id="sign-in-button">
            LOGIN
          </button>
        </Col>
      </Row>
      <div className="banner">새로운 커뮤니티의 시작♡ DAILY FIELD</div>
    </div>
  );
};

export default Header;

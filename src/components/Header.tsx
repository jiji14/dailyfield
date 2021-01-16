import React, { useState } from "react";
import { Row, Col, Modal } from "antd";
import "antd/dist/antd.css";
import "./Header.css";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

let appVerifier: firebase.auth.ApplicationVerifier | null = null;

const Header = (): JSX.Element => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(firebase.auth().currentUser);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const changePhoneNumber = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPhoneNumber(value);
  };

  const signInWithPhoneNumber = async () => {
    if (!appVerifier) {
      appVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
        size: "invisible",
      });
    }

    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);
      const code = window.prompt("코드를 입력해주세요.") || "";
      const result = await confirmationResult.confirm(code);
      const { user } = result;
      const db = firebase.firestore();
      const doc = await db.collection("users").doc(user?.uid).get();
      const isNewUser = await !doc.exists;
      await hideModal();
      if (isNewUser) {
        await history.push("/signup");
      } else {
        await setUser(user);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      await setUser(null);
    } catch (error) {
      window.alert(error);
    }
  };

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
        <Col span={4} className="signin">
          {!user ? (
            <button
              onClick={showModal}
              id="sign-in-button"
              className="headerButton"
            >
              SIGNIN
            </button>
          ) : (
            <button onClick={signOut} className="headerButton">
              SIGNOUT
            </button>
          )}
        </Col>
      </Row>
      <div className="banner">새로운 커뮤니티의 시작♡ DAILY FIELD</div>
      <Modal
        title="SIGNIN"
        visible={isModalVisible}
        onOk={signInWithPhoneNumber}
        onCancel={hideModal}
        cancelText="취소"
        okText="로그인"
      >
        <h3>핸드폰번호</h3>
        <input
          value={phoneNumber}
          onChange={changePhoneNumber}
          placeholder="핸드폰번호"
        />
      </Modal>
    </div>
  );
};

export default Header;

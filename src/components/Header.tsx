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

  const signInWithPhoneNumber = () => {
    if (!appVerifier) {
      appVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
        size: "invisible",
      });
    }

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        const code = window.prompt("코드를 입력해주세요.") || "";
        confirmationResult
          .confirm(code)
          .then(function (result) {
            const { user } = result;
            const isNewUser = result.additionalUserInfo?.isNewUser;

            if (isNewUser) {
              history.push({
                pathname: "/signup",
                state: {
                  user: user,
                },
              });
            } else {
              setUser(user);
              hideModal();
            }
          })
          .catch((e) => {
            window.alert(e);
          });
      })
      .catch(function (error) {
        window.alert(error);
      });
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        setUser(null);
      })
      .catch(function (error) {
        window.alert(error);
      });
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
            <button
              onClick={signOut}
              id="sign-out-button"
              className="headerButton"
            >
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

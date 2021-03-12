import React, { useState, useEffect } from "react";
import { Row, Col, Modal } from "antd";
import "antd/dist/antd.css";
import "./Header.css";
import firebase from "firebase";
import { useHistory, NavLink } from "react-router-dom";
import { CollectionName } from "../collections";

let appVerifier: firebase.auth.ApplicationVerifier | null = null;

const Header = (): JSX.Element => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(firebase.auth().currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

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
    const regExp = /^01(?:0|1|[6-9])(?:\d{7}|\d{8})$/;
    if (!regExp.test(phoneNumber)) {
      window.alert(
        "올바른 번호가 아닙니다. 다시한번 확인해주세요. (ex)01012345678"
      );
      return;
    }
    setLoading(true);
    const proccessedPhoneNumber =
      "+82" + phoneNumber.substring(1, phoneNumber.length);

    if (!appVerifier) {
      appVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
        size: "invisible",
      });
    }

    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(proccessedPhoneNumber, appVerifier);
      const code = window.prompt("코드를 입력해주세요.") || "";
      const { user } = await confirmationResult.confirm(code);
      const db = firebase.firestore();
      const doc = await db
        .collection(CollectionName.usersCollectionName)
        .doc(user?.uid)
        .get();
      const isNewUser = !doc.exists;
      hideModal();
      if (isNewUser) {
        history.push("/signup");
      } else {
        setUser(user);
      }
    } catch (error) {
      window.alert(error);
    }
    setLoading(false);
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
    } catch (error) {
      window.alert(error);
    }
  };

  const submitPhoneNumber = (event: React.FormEvent<HTMLFormElement>) => {
    // onSubmit하면 window.location.reload()되는 현상 막기위해 event.preventDefault() 코드 사용
    event.preventDefault();
    signInWithPhoneNumber();
  };

  return (
    <div className="headerContainer">
      <Row className="header">
        <Col span={6}>
          <NavLink to="/matches" className="logo">
            DAILY FIELD
          </NavLink>
        </Col>
        <Col span={12} className="linkContainer">
          <NavLink
            to="/matches"
            activeClassName="selectedLink"
            className="defaultLink"
          >
            MATCH
          </NavLink>
          <NavLink
            to="/recurringclasses"
            activeClassName="selectedLink"
            className="defaultLink"
          >
            기획반
          </NavLink>
          <a
            className="dm"
            href="http://pf.kakao.com/_vQNPK"
            target="_blank"
            rel="noreferrer"
          >
            문의
          </a>
        </Col>
        <Col span={6} className="signin">
          {!user ? (
            <button
              onClick={showModal}
              id="sign-in-button"
              data-testid="sign-in-button"
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
        confirmLoading={loading}
      >
        <form onSubmit={submitPhoneNumber}>
          <h3>핸드폰번호</h3>
          <input
            value={phoneNumber}
            onChange={changePhoneNumber}
            className="phoneNumber"
            placeholder="- 없이 숫자만 입력해주세요. (ex)01012345678"
          />
          <ul>
            <li>
              핸드폰번호 입력 후 로그인 버튼을 클릭하면 인증번호가 발송됩니다.
              인증번호 입력후 로그인 하실 수 있습니다.
            </li>
            <li>
              신규회원인 경우 회원가입 페이지로 전환되니 회원가입을 진행후
              로그인해주세요.
            </li>
          </ul>
        </form>
      </Modal>
    </div>
  );
};

export default Header;

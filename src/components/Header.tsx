import React from "react";
import { Row, Col } from "antd";
import "antd/dist/antd.css";
import "./Header.css";

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
          LOGIN
        </Col>
      </Row>
      <div className="infobar">새로운 커뮤니티의 시작♡ DAILY FIELD</div>
    </div>
  );
};

export default Header;

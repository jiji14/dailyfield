import React from "react";
import {
  Row,
  Col,
  Divider,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Button,
} from "antd";
import "antd/dist/antd.css";
import "./Signup.css";

const { Option } = Select;

const Signup = (): JSX.Element => {
  const options = [
    { label: "스포티", value: "sporty" },
    { label: "취미", value: "hobby" },
    { label: "초급", value: "beginner" },
  ];

  return (
    <div className="signUp">
      <div className="signUpContainer">
        <Row align="middle" className="signUpTitle">
          필수사항
        </Row>
        <Divider className="divider" />
        <Row align="middle" className="marginBottom">
          <Col span={6} className="signUpSubtitle">
            이름
          </Col>
          <Col span={18} className="alignRight">
            <Input placeholder="이름을 입력해주세요." />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} className="signUpSubtitle">
            생년월일
          </Col>
          <Col span={18} className="alignRight">
            <DatePicker />
          </Col>
        </Row>
      </div>
      <div>
        <Row align="middle" className="signUpTitle">
          선택사항
        </Row>
        <Divider className="divider" />
        <Row align="middle" className="marginBottom">
          <Col span={6} className="signUpSubtitle">
            성별
          </Col>
          <Col span={18} className="alignRight">
            <Select defaultValue="남성" style={{ width: 120 }}>
              <Option value="남성">남성</Option>
              <Option value="여성">여성</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6} className="signUpSubtitle">
            테마
          </Col>
          <Col span={18} className="alignRight">
            <div className="signUpSubtitle"> 중복선택 가능합니다.</div>
            <Checkbox.Group options={options} defaultValue={["sporty"]} />
          </Col>
        </Row>
      </div>
      <div className="signUpButtonContainer">
        <Button type="primary">가입하기</Button>
      </div>
    </div>
  );
};

export default Signup;

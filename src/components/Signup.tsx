import React, { useState } from "react";
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
import Header from "./Header";
import moment, { Moment } from "moment";
import firebase from "firebase";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { Player } from "../types";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const Signup = (): JSX.Element => {
  const history = useHistory();
  const options = [
    { label: "스포티", value: "sporty" },
    { label: "취미", value: "hobby" },
    { label: "초급", value: "beginner" },
  ];
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Moment>(moment);
  const [gender, setGender] = useState<"남성" | "여성">("남성");
  const [theme, setTheme] = useState<CheckboxValueType[]>([]);

  const changeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const changeBirthdate = (dateObj: Moment | null) => {
    setBirthDate(moment(dateObj ? dateObj : birthDate));
  };

  const changeGender = (gender: "남성" | "여성") => {
    setGender(gender);
  };

  const changeTheme = (checkedValue: CheckboxValueType[]) => {
    setTheme(checkedValue);
  };

  const signUp = () => {
    const phoneNumber = firebase.auth().currentUser?.phoneNumber || "";
    const user: Player = {
      name: name,
      gender: gender,
      phoneNumber: phoneNumber,
      birthDate: birthDate.toDate(),
      matchesPlayed: 0,
      theme: theme,
    };
    const db = firebase.firestore();
    db.collection("users")
      .add(user)
      .then(function () {
        window.alert("회원가입을 축하합니다!");
        history.push("/");
      })
      .catch(function (error) {
        window.alert(error);
      });
  };

  return (
    <div>
      <Header />
      <div className="signUp">
        <section className="signUpContainer">
          <h3>필수사항</h3>
          <Divider className="divider" />
          <Row align="middle" className="Row">
            <Col span={6} className="signUpSubtitle">
              이름
            </Col>
            <Col span={18}>
              <Input
                onChange={changeName}
                value={name}
                placeholder="이름을 입력해주세요."
              />
            </Col>
          </Row>
          <Row align="middle" className="Row">
            <Col span={6} className="signUpSubtitle">
              생년월일
            </Col>
            <Col span={18}>
              <DatePicker onChange={changeBirthdate} value={birthDate} />
            </Col>
          </Row>
        </section>
        <section className="signUpContainer">
          <h3>선택사항</h3>
          <Divider className="divider" />
          <Row align="middle" className="Row">
            <Col span={6} className="signUpSubtitle">
              성별
            </Col>
            <Col span={18}>
              <Select
                value={gender}
                onChange={changeGender}
                className="signUpSelect"
                data-testid="signUpSelect"
              >
                <Option value="남성">남성</Option>
                <Option value="여성">여성</Option>
              </Select>
            </Col>
          </Row>
          <Row align="middle" className="Row">
            <Col span={6} className="signUpSubtitle">
              테마
            </Col>
            <Col span={18}>
              <div className="signUpSubtitle"> 중복선택 가능합니다.</div>
              <Checkbox.Group
                options={options}
                onChange={changeTheme}
                value={theme}
                data-testid="signUpCheckbox"
              />
            </Col>
          </Row>
        </section>
        <div className="signUpButtonContainer">
          <Button type="primary" onClick={signUp}>
            가입하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

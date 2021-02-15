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
import { Moment } from "moment";
import firebase from "firebase";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { Player, Gender } from "../types";
import { useHistory } from "react-router-dom";
import { CollectionName } from "../collections";

const { Option } = Select;
const Options = [
  { label: "스포티", value: "sporty" },
  { label: "취미", value: "hobby" },
  { label: "초급", value: "beginner" },
];

const Signup = (): JSX.Element => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Moment | null>(null);
  const [gender, setGender] = useState<Gender>("남성");
  const [purpose, setPurpose] = useState<string[]>([]);

  const changeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const changePurpose = (checkedValue: CheckboxValueType[]) => {
    setPurpose(checkedValue as string[]);
  };

  const signUp = async () => {
    if (name.length < 1) {
      window.alert("이름을 입력해주세요.");
      return;
    }

    if (!birthDate) {
      window.alert("생일을 입력해주세요.");
      return;
    }

    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      window.alert("인증절차를 진행후 회원가입을 진행해주세요.");
      return;
    }

    const user: Player = {
      name,
      gender,
      phoneNumber: currentUser.phoneNumber || "",
      birthDate: birthDate?.toDate(),
      matchesPlayed: 0,
      purpose,
    };

    try {
      const db = firebase.firestore();
      await db
        .collection(CollectionName.usersCollectionName)
        .doc(currentUser.uid)
        .set(user);
      window.alert("회원가입을 축하합니다!");
      history.push("/");
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="signUp">
      <section className="signUpContainer">
        <h3>필수사항</h3>
        <Divider className="divider" />
        <Row align="middle" className="row">
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
        <Row align="middle" className="row">
          <Col span={6} className="signUpSubtitle">
            생년월일
          </Col>
          <Col span={18}>
            <DatePicker
              data-testid="birthDate"
              onChange={setBirthDate}
              value={birthDate}
            />
          </Col>
        </Row>
      </section>
      <section className="signUpContainer">
        <h3>선택사항</h3>
        <Divider className="divider" />
        <Row align="middle" className="row">
          <Col span={6} className="signUpSubtitle">
            성별
          </Col>
          <Col span={18}>
            <Select
              value={gender}
              onChange={setGender}
              className="signUpSelect"
              data-testid="signUpSelect"
            >
              <Option value="남성">남성</Option>
              <Option value="여성">여성</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="signUpSubtitle">
            테마
          </Col>
          <Col span={18}>
            <div className="signUpSubtitle"> 중복선택 가능합니다.</div>
            <Checkbox.Group
              options={Options}
              onChange={changePurpose}
              value={purpose}
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
  );
};

export default Signup;

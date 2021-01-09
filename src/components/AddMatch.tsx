import React, { useState } from "react";
import { Row, Col, Divider, Input, DatePicker, Select, Button } from "antd";
import "antd/dist/antd.css";
import "./Signup.css";
import { Moment } from "moment";
import firebase from "firebase";
import { Gender, Level, GameType, Match } from "../types";
import { useHistory } from "react-router-dom";

const { Option } = Select;
const timeOption = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const countOption = [10, 15, 18, 20];

const AddMatch = (): JSX.Element => {
  const history = useHistory();

  const [gameDate, setGameDate] = useState<Moment | null>(null);
  const [time, setTime] = useState(8);
  const [place, setPlace] = useState("");
  const [memberCount, setMemberCount] = useState(10);
  const [teamCount, setTeamCount] = useState(2);
  const [gender, setGender] = useState<Gender>("남성");
  const [level, setLevel] = useState<Level>("초급");
  const [link, setLink] = useState("");
  const [gameType, setGameType] = useState<GameType>("gx+match");
  const [fee, setFee] = useState(20000);
  const [canPark, setCanPark] = useState("true");
  const [canRentShoes, setCanRentShoes] = useState("true");
  const [manager, setManager] = useState("배성진");

  const changePlace = (e: React.FormEvent<HTMLInputElement>) => {
    setPlace(e.currentTarget.value);
  };

  const changeLink = (e: React.FormEvent<HTMLInputElement>) => {
    setLink(e.currentTarget.value);
  };

  const changeManager = (e: React.FormEvent<HTMLInputElement>) => {
    setManager(e.currentTarget.value);
  };

  const addMatch = () => {
    const parkBool = canPark === "true" ? true : false;
    const rentBool = canRentShoes === "true" ? true : false;
    const date = gameDate?.toDate() || null;
    if (date) date.setUTCHours(time, 0, 0);

    const match: Match = {
      dateTime: date || null,
      place: place,
      memberCount: memberCount,
      teamCount: teamCount,
      gender: gender,
      level: level,
      link: link,
      gameType: gameType,
      fee: fee,
      canPark: parkBool,
      canRentShoes: rentBool,
      manager: manager,
    };

    const db = firebase.firestore();
    db.collection("matches")
      .doc()
      .set(match)
      .then(function () {
        window.alert("매치가 등록되었습니다!");
        history.push("/");
      })
      .catch(function (error) {
        window.alert(error);
      });
  };

  return (
    <div className="signUp">
      <h3>
        <b>매치등록</b>
      </h3>
      <Divider className="divider" />
      <section className="signUpContainer">
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            날짜
          </Col>
          <Col span={18}>
            <DatePicker
              data-testid="gameDate"
              onChange={setGameDate}
              value={gameDate}
            />
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            시간
          </Col>
          <Col span={18}>
            <Select
              value={time}
              onChange={setTime}
              className="signUpSelect"
              data-testid="timeSelect"
            >
              {timeOption.map((time) => {
                return (
                  <Option key={time} value={time}>
                    {time + "시"}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            경기장
          </Col>
          <Col span={18}>
            <Input
              onChange={changePlace}
              value={place}
              placeholder="경기장을 입력해주세요."
            />
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            인원
          </Col>
          <Col span={6}>
            <Select
              value={memberCount}
              onChange={setMemberCount}
              className="signUpSelect"
              data-testid="memberCountSelect"
            >
              {countOption.map((count) => {
                return (
                  <Option key={"member" + count} value={count}>
                    {count + "명"}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6} className="signUpSubtitle">
            종류
          </Col>
          <Col span={6}>
            <Select
              value={teamCount}
              onChange={setTeamCount}
              className="signUpSelect"
              data-testid="teamCountSelect"
            >
              <Option value={2}>2파전</Option>
              <Option value={3}>3파전</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            성별
          </Col>
          <Col span={6}>
            <Select
              value={gender}
              onChange={setGender}
              className="signUpSelect"
              data-testid="genderSelect"
            >
              <Option value="남성">남성</Option>
              <Option value="여성">여성</Option>
              <Option value="혼성">혼성</Option>
            </Select>
          </Col>
          <Col span={6} className="signUpSubtitle">
            레벨
          </Col>
          <Col span={6}>
            <Select
              value={level}
              onChange={setLevel}
              className="signUpSelect"
              data-testid="levelSelect"
            >
              <Option value="초급">초급</Option>
              <Option value="중급">중급</Option>
              <Option value="고급">고급</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            링크
          </Col>
          <Col span={18}>
            <Input
              onChange={changeLink}
              value={link}
              placeholder="링크를 입력해주세요."
            />
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            종류
          </Col>
          <Col span={6}>
            <Select
              value={gameType}
              onChange={setGameType}
              className="signUpSelect"
              data-testid="gameTypeSelect"
            >
              <Option value="gx">GX만</Option>
              <Option value="match">매치만</Option>
              <Option value="gx+match">GX+매치</Option>
            </Select>
          </Col>
          <Col span={6} className="signUpSubtitle">
            참가비
          </Col>
          <Col span={6}>
            <Select
              value={fee}
              onChange={setFee}
              className="signUpSelect"
              data-testid="feeSelect"
            >
              <Option value={10000}>1만원</Option>
              <Option value={20000}>2만원</Option>
              <Option value={30000}>3만원</Option>
              <Option value={40000}>4만원</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            주차
          </Col>
          <Col span={6}>
            <Select
              value={canPark}
              onChange={setCanPark}
              className="signUpSelect"
              data-testid="canParkSelect"
            >
              <Option value="true">가능</Option>
              <Option value="false">불가능</Option>
            </Select>
          </Col>
          <Col span={6} className="signUpSubtitle">
            풋살화
          </Col>
          <Col span={6}>
            <Select
              value={canRentShoes}
              onChange={setCanRentShoes}
              className="signUpSelect"
              data-testid="canRentSelect"
            >
              <Option value="true">가능</Option>
              <Option value="false">불가능</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="Row">
          <Col span={6} className="signUpSubtitle">
            매니저
          </Col>
          <Col span={18}>
            <Input
              onChange={changeManager}
              value={manager}
              placeholder="매니저를 입력해주세요."
            />
          </Col>
        </Row>
      </section>
      <Divider className="divider" />
      <div className="signUpButtonContainer">
        <Button type="primary" onClick={addMatch}>
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default AddMatch;

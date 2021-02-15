import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Divider,
  Input,
  DatePicker,
  Select,
  Button,
  Checkbox,
  InputNumber,
} from "antd";
import "antd/dist/antd.css";
import "./AddMatch.css";
import moment, { Moment } from "moment";
import firebase from "firebase";
import { Gender, Level, GameType, Match } from "../types";
import { useHistory, Link } from "react-router-dom";

const { Option } = Select;

const AddMatch = (props: { id: string }): JSX.Element => {
  const { id } = props;
  const history = useHistory();

  const [gameDate, setGameDate] = useState<Moment | null>(null);
  const [place, setPlace] = useState("");
  const [memberCount, setMemberCount] = useState(18);
  const [teamCount, setTeamCount] = useState(2);
  const [gender, setGender] = useState<Gender>("남성");
  const [level, setLevel] = useState<Level>("초급");
  const [link, setLink] = useState("");
  const [gameType, setGameType] = useState<GameType>("gx+match");
  const [fee, setFee] = useState(20000);
  const [canPark, setCanPark] = useState(true);
  const [canRentShoes, setCanRentShoes] = useState(false);
  const [manager, setManager] = useState("배성진");

  useEffect(() => {
    (async () => {
      if (!id) return;
      const db = firebase.firestore();
      const doc = await db.collection("matches").doc(id).get();
      if (!doc.exists) {
        window.alert("잘못된 접근입니다. 목록페이지로 돌아갑니다.");
        history.push("/");
        return;
      }

      const match = doc.data();
      if (!match) return;
      setGameDate(moment(match.dateTime.toDate()));
      setPlace(match.place);
      setMemberCount(match.memberCount);
      setTeamCount(match.teamCount);
      setGender(match.gender);
      setLevel(match.level);
      setLink(match.link);
      setGameType(match.gameType);
      setFee(match.fee);
      setCanPark(match.canPark);
      setCanRentShoes(match.canRentShoes);
      setManager(match.manager);
    })();
  }, [history, id]);

  const changePlace = (e: React.FormEvent<HTMLInputElement>) => {
    setPlace(e.currentTarget.value);
  };

  const changeLink = (e: React.FormEvent<HTMLInputElement>) => {
    setLink(e.currentTarget.value);
  };

  const changeManager = (e: React.FormEvent<HTMLInputElement>) => {
    setManager(e.currentTarget.value);
  };

  const changeMemberCount = (value: number) => {
    setMemberCount(value);
  };

  const addMatch = async () => {
    if (!gameDate) {
      window.alert("매치 일시를 선택해주세요.");
      return;
    }
    if (place.length < 1) {
      window.alert("매치 장소를 입력해주세요.");
      return;
    }

    const match: Match = {
      dateTime: gameDate.toDate(),
      place,
      memberCount,
      teamCount,
      gender,
      level,
      link,
      gameType,
      fee,
      canPark,
      canRentShoes,
      manager,
    };

    try {
      const db = firebase.firestore();
      await db.collection("matches").add(match);
      window.alert("매치가 등록되었습니다!");
      history.push("/");
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="addMatch">
      <Divider className="divider" />
      {id ? <h2>매치수정</h2> : <h2>매치등록</h2>}
      <section className="addMatchContainer">
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
            날짜
          </Col>
          <Col span={18}>
            <DatePicker
              data-testid="gameDate"
              showTime={true}
              onChange={setGameDate}
              value={gameDate}
            />
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
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
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
            인원
          </Col>
          <Col span={6}>
            <InputNumber
              min={1}
              max={30}
              value={memberCount}
              placeholder="멤버수를 입력해주세요."
              onChange={(value) => {
                changeMemberCount(value as number);
              }}
            />
          </Col>
          <Col span={6} className="addMatchSubtitle">
            종류
          </Col>
          <Col span={6}>
            <Select
              value={teamCount}
              onChange={setTeamCount}
              className="addMatchSelect"
              data-testid="teamCountSelect"
            >
              <Option value={2}>2파전</Option>
              <Option value={3}>3파전</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
            성별
          </Col>
          <Col span={6}>
            <Select
              value={gender}
              onChange={setGender}
              className="addMatchSelect"
              data-testid="genderSelect"
            >
              <Option value="남성">남성</Option>
              <Option value="여성">여성</Option>
              <Option value="혼성">혼성</Option>
            </Select>
          </Col>
          <Col span={6} className="addMatchSubtitle">
            레벨
          </Col>
          <Col span={6}>
            <Select
              value={level}
              onChange={setLevel}
              className="addMatchSelect"
              data-testid="levelSelect"
            >
              <Option value="초급">초급</Option>
              <Option value="중급">중급</Option>
              <Option value="고급">고급</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
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
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
            종류
          </Col>
          <Col span={6}>
            <Select
              value={gameType}
              onChange={setGameType}
              className="addMatchSelect"
              data-testid="gameTypeSelect"
            >
              <Option value="gx">GX만</Option>
              <Option value="match">매치만</Option>
              <Option value="gx+match">GX+매치</Option>
            </Select>
          </Col>
          <Col span={6} className="addMatchSubtitle">
            참가비
          </Col>
          <Col span={6}>
            <Select
              value={fee}
              onChange={setFee}
              className="addMatchSelect"
              data-testid="feeSelect"
            >
              <Option value={10000}>1만원</Option>
              <Option value={20000}>2만원</Option>
              <Option value={30000}>3만원</Option>
              <Option value={40000}>4만원</Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
            주차
          </Col>
          <Col span={6}>
            <Checkbox
              data-testid="canPark"
              value={canPark}
              checked={canPark}
              onChange={(e) => {
                setCanPark(e.target.checked);
              }}
            >
              주차 가능
            </Checkbox>
          </Col>
          <Col span={6} className="addMatchSubtitle">
            풋살화
          </Col>
          <Col span={6}>
            <Checkbox
              data-testid="canRentShoes"
              value={canRentShoes}
              checked={canRentShoes}
              onChange={(e) => {
                setCanRentShoes(e.target.checked);
              }}
            >
              풋살화 대여 가능
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle" className="row">
          <Col span={6} className="addMatchSubtitle">
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

      <div className="addMatchButtonContainer">
        {id ? (
          <>
            <Button type="primary">수정하기</Button>
            <Button danger>삭제하기</Button>
          </>
        ) : (
          <Button type="primary" onClick={addMatch}>
            등록하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddMatch;

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
import { Gender, GameType, Match } from "../types";
import { CollectionName } from "../collections";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const AddMatch = (props: { id: string }): JSX.Element => {
  const { id } = props;
  const history = useHistory();

  const [gameDate, setGameDate] = useState<Moment | null>(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [memberCount, setMemberCount] = useState(18);
  const [gender, setGender] = useState<Gender>("남성");
  const [link, setLink] = useState("");
  const [gameType, setGameType] = useState<GameType>("gx+match");
  const [fee, setFee] = useState(20000);
  const [canPark, setCanPark] = useState(true);
  const [isRecurringClass, setIsRecurringClass] = useState(false);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [manager, setManager] = useState("배성진");

  useEffect(() => {
    (async () => {
      if (!id) return;
      const db = firebase.firestore();
      const doc = await db
        .collection(CollectionName.matchesCollectionName)
        .doc(id)
        .get();
      if (!doc.exists) {
        window.alert("잘못된 접근입니다. 목록페이지로 돌아갑니다.");
        history.push("/");
        return;
      }

      const match = doc.data();
      if (!match) return;
      setGameDate(moment(match.dateTime.toDate()));
      setTitle(match.title);
      setPlace(match.place);
      setMemberCount(match.memberCount);
      setGender(match.gender);
      setLink(match.link);
      setGameType(match.gameType);
      setFee(match.fee);
      setCanPark(match.canPark);
      setIsRecurringClass(match.isRecurringClass);
      setEndDate(moment(match.endDate?.toDate()));
      setManager(match.manager);
    })();
  }, [history, id]);

  const changeTitle = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

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

  const changeFee = (value: number) => {
    setFee(value);
  };

  const addMatch = async () => {
    const match = getMatch();
    if (!match) return;

    try {
      const db = firebase.firestore();
      await db.collection(CollectionName.matchesCollectionName).add(match);
      window.alert("매치가 등록되었습니다!");
      history.push("/");
    } catch (error) {
      window.alert(error);
    }
  };

  const updateMatch = async () => {
    const match = getMatch();
    if (!match) return;
    try {
      const db = firebase.firestore();
      await db
        .collection(CollectionName.matchesCollectionName)
        .doc(id)
        .set(match);
      window.alert("매치가 수정되었습니다!");
      history.push("/");
    } catch (error) {
      window.alert(error);
    }
  };

  const deleteMatch = async () => {
    if (!id) return;
    const isConfirmedWithDelete =
      window.confirm("해당 매치를 삭제하시겠습니까?");
    if (!isConfirmedWithDelete) return;

    try {
      const db = firebase.firestore();
      await db
        .collection(CollectionName.matchesCollectionName)
        .doc(id)
        .delete();
      window.alert("매치가 삭제되었습니다!");
      history.push("/");
    } catch (error) {
      window.alert(error);
    }
  };

  const getMatch = () => {
    if (!gameDate) {
      window.alert("매치 일시를 선택해주세요.");
      return null;
    }
    if (title.length < 1) {
      window.alert("제목을 입력해주세요.");
      return null;
    }
    if (place.length < 1) {
      window.alert("매치 장소를 입력해주세요.");
      return null;
    }

    if (isRecurringClass && !endDate) {
      window.alert("기획반 종료일을 입력해주세요.");
      return null;
    }

    const match: Match = {
      dateTime: gameDate.toDate(),
      title,
      place,
      memberCount,
      gender,
      link,
      gameType,
      fee,
      canPark,
      isRecurringClass,
      endDate: endDate?.toDate(),
      manager,
    };
    return match;
  };

  return (
    <>
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
            제목
          </Col>
          <Col span={18}>
            <Input
              onChange={changeTitle}
              value={title}
              placeholder="제목을 입력해주세요."
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
              <Option value="여성초급">여성초급</Option>
              <Option value="혼성원팀">혼성원팀</Option>
              <Option value="남성초급">남성초급</Option>
              <Option value="여성초중급">여성초중급</Option>
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
            <InputNumber
              value={fee}
              data-testid="feeInput"
              placeholder="금액을 입력해주세요."
              onChange={(value) => {
                changeFee(value as number);
              }}
            />
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
            기획반 여부
          </Col>
          <Col span={6}>
            <Checkbox
              data-testid="isRecurringClass"
              value={isRecurringClass}
              checked={isRecurringClass}
              onChange={(e) => {
                setIsRecurringClass(e.target.checked);
              }}
            >
              기획반
            </Checkbox>
          </Col>
        </Row>
        {isRecurringClass && (
          <Row align="middle" className="row">
            <Col span={6} className="addMatchSubtitle">
              기획반 종료일
            </Col>
            <Col span={18}>
              <DatePicker
                data-testid="endDate"
                showTime={true}
                onChange={setEndDate}
                value={endDate}
              />
            </Col>
          </Row>
        )}
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
            <Button type="primary" onClick={updateMatch}>
              수정하기
            </Button>
            <Button danger onClick={deleteMatch}>
              삭제하기
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={addMatch}>
            등록하기
          </Button>
        )}
      </div>
    </>
  );
};

export default AddMatch;

import React from 'react';
import { Row, Col, Divider } from 'antd';
import Label from './Label';
import 'antd/dist/antd.css';
import '../assets/css/components/MatchList.css';


interface Match {
    id: number,
    date: string,
    time: string,
    place: string,
    memberCount: number,
    teamCount: number,
    sex: string,
    level: string,
    link: string,
    gameType: string,
    fee: number,
    isAbleToPark: boolean,
    isAbleToRentShoes: boolean,
    manager: string
}

const match: Match = {
    id: 1,
    date: '2020-12-22 수',
    time: '12:00',
    place: '용산 더베이스',
    memberCount: 15,
    teamCount: 3,
    sex: '여성',
    level: '초급',
    link: 'naver.com',
    gameType: 'GX+매치',
    fee: 20000,
    isAbleToPark: true,
    isAbleToRentShoes: false,
    manager: '배성진'
}

const MatchList = () => {
    
    return (
        <>
        <Row align="middle">
            <Col span={6}>
                <div className='timeText'>{match.time}</div>
            </Col>
            <Col span={12}>
                <div className='placeText'>{match.place}</div>
                <div className='infoContainer'>
                    <div className='infoText'>{match.sex}</div>
                    <div className='infoText'>{match.memberCount}명</div>
                    <div className='infoText'>{match.level}</div>
                </div>
            </Col>
            <Col span={6} >
                <Label 
                    labelName="신청가능"
                    color="orange"
                />
            </Col>
        </Row>
        <Divider className='matchListDivider' />
        </>
    )
}

export default MatchList;
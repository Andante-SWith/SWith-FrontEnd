import React, {Component} from "react";
//import {StyleSheet, Text, View} from 'react-native';
import styled from "styled-components";
import Topbar from "./topbar";
import Container from 'react-bootstrap/Container'
import BtnPrev from "../../images/Prev.svg";
import BtnNext from "../../images/Next.svg";
import study from "../../images/study.png";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar"

const Wrap = styled.div`
  display: flex;
  //flexDirection: Col
  min-height: 800px;
  min-width: 800px;
  text-align: center;
  //align-items: center;
`;
const HomePage = styled.div`  
  width: 100%;
  display: flex;
  height: 482px;
  padding: 0 0 0;
  margin: 66px 0 0;
  border: solid 1px #ccc;
  background-color: #fafbfc;
`;
const EmptyBox = styled.div`
  width: 66%;
  height: 310px;//244
  margin: 120px 17% 0 17%;
  //padding: 0 56px 0 0;
  //border: solid 1px #ccc;
  //background-color: #ffffff
`;
const HistoryBox = styled.div`
  width: 216px;
  height: 244px;
  border: solid 1px #ccc;
  background-color: #fafafa;
  border-radius: 5px;
`;
// const HistoryBoxImg = styled.div`
//   width: 216px;
//   height: 144px;
//   //background-color: #ffffff;
//   border-radius: 5px;
// `;

const TextBox = styled.div`
  //width: 87px;
  //height: 26px;
  flex-grow: 0;
  //margin: 0 548px 40px 0;
  font-family: Roboto;
  font-size: 22px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #000;
`;

// style= {{margin:'0 548px 40px 0',height: "29px", width: '717.88px'}}
//컨테이너 엠프티박스로 바꾸고 페이지 넘기는 화살표 위치 제대로..
const index = () => {
  return (
    <Wrap>
      <Topbar/>
      <HomePage>
        <EmptyBox>
          <EmptyBox style = {{margin:'0',width:'60%'}}>
            <Container style= {{margin:'0 0 48px 0',width: '720px'}}>
              <TextBox style = {{fontWeight:'bold',width:'600px'}}>내 스터디</TextBox>
              <Container style = {{margin:'-37px 0 0 660px',width:'60px',height:'29px'}}>
                <img
                  style={{ height: "50px", width: "30px" }}
                  src={BtnPrev}
                  alt="BtnPrev"
                />
                <img
                  style={{ height: "50px", width: "30px" }}
                  src={BtnNext}
                  alt="BtnNext "
                />
              </Container>
            </Container>
            
            <HistoryBox>
              {/* <HistoryBoxImg/> */}
              <img
                style={{ height: "144px", width: "216px" }}
                src={study}
                alt="study"
              />
              <TextBox style = {{width: '180px',height: '70px',margin: '15px 18px 0',fontSize: '17px'}}>스터디 이름</TextBox>
            </HistoryBox>
            <HistoryBox  style={{ margin: '-246.6px 250px' }}>
              {/* <HistoryBoxImg/> */}
              <img
                style={{ height: "144px", width: "216px" }}
                src={study}
                alt="study"
              />
              <TextBox style = {{width: '180px',height: '70px',margin: '15px 18px 0',fontSize: '17px'}}>스터디 이름</TextBox>
            </HistoryBox>
            <HistoryBox  style={{ margin: '0 500px', backgroundColor: '#454648'}}>
            <TextBox style = {{width: '178px',height: '60px',fontSize: '17px', fontWeight:'bold',color:'#fafafa',margin:'92px 19px',textAlign:'center'}}>
              내가 만든 스터디 또는 초대 받은 스터디가 등록됩니다.
            </TextBox>
            </HistoryBox>
          </EmptyBox>
          <EmptyBox style = {{margin:'-308px 0 0 760px',width:'40%'}}>
            <TextBox style = {{fontWeight:'bold',margin: '0'}}>학습 시간</TextBox>
            <HistoryBox style={{ width: '508px', height: '244px', margin: '38px 0 0 0', backgroundColor: '#fff'}}>
            <EmptyBox style={{justifyContent:'space-between',flexDirection:'column',flex:'1',margin:'39px 28px',width:'452px',height:'166px'}}>
              <EmptyBox style={{width:'100%',height:'44px',margin:'0'}}>
                <TextBox style = {{fontWeight:'bold',fontSize:'12px'}}>오늘 공부한 시간</TextBox>
                <TextBox style = {{fontWeight:'bold',fontSize:'17px'}}>0시간 0분</TextBox>
              </EmptyBox>
              <EmptyBox style= {{backgroundColor:'#ccc',margin:'35px 0 30px',width:'100%',height:'1px'}}/>
              <EmptyBox style={{width:'100%', height:'58px',margin:'0 0 20px'}}>
                <TextBox style = {{fontWeight:'bold',fontSize:'15px'}}>오늘 목표 당성률</TextBox>
                <EmptyBox style={{margin:'10px 0 0',width:'100%',height:'10px'}}>
                  <EmptyBox style={{margin:'0',width :'90%',height:'10px',borderRadius:'100px',backgroundColor:'#e4e6eb'}}/>
                  <EmptyBox style={{margin:'-10px 0 0',width :'45%',height:'10px',borderRadius:'100px',backgroundColor:'#ef8585'}}/>
                  <TextBox style = {{margin:'-17px 0 0',fontSize:'15px',textAlign:'right',color:'#ef8585'}}>50%</TextBox>
                </EmptyBox>
              </EmptyBox>
            </EmptyBox>
            </HistoryBox>
          </EmptyBox>
        </EmptyBox>
      </HomePage>

    </Wrap>
  );
};

export default index;
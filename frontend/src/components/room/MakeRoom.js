import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from '../../api/defaultaxios';
import Topbar from '../topbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import moment from 'moment';

const Container = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  margin-top: 50px;
  .page {
    display: flex;
    position: relative;
    margin: 0 auto;
    padding: 50px 50px 63px;

    flex-direction: column;
  }
`;
const Rowarea = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  border-bottom: 1px dashed #ef8585;
  .react-datepicker-wrapper {
    width: auto;
  }
  .container {
    display: flex;
  }
  .tag {
    display: flex;
    align-items: center;
    margin: 7px 0;
    margin-right: 10px;
    padding: 0 10px;
    padding-right: 5px;
    border: 1px solid #ef8585;
    border-radius: 5px;
    background-color: #ef8585;
    white-space: nowrap;
    color: white;
  }

  .tag button {
    display: flex;
    padding: 6px;
    border: none;
    background-color: unset;
    cursor: pointer;
    color: white;
  }
`;
const Label = styled.label`
  display: flex;
  padding: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  line-height: 1;
`;
const Input = styled.input`
  padding: 15px;
  margin-left: 10px;
  background-color: white;
  border: 1px solid #828282;
  border-radius: 3px;
  font-size: 15px;
  font-weight: normal;
  font-family: Roboto;
`;
const DateInput = styled(DatePicker)`
  padding: 15px;
  margin-left: 10px;
  background-color: white;
  border: 1px solid #828282;
  border-radius: 3px;
  font-size: 15px;
  font-weight: normal;
  font-family: Roboto;
`;
const TabWrap = styled.div`
  width: 182px;
  font-family: Roboto;
  font-size: 14px;
  display: flex;
  align-items: center;
  display: table;
  margin: 20px auto;
  .active {
    border: 1px solid #ef8585;
    background-color: #ef8585;
    font-weight: 700;
    color: #fff;
  }
`;
const Button = styled.button`
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ef8585;
  font-size: 0.95rem;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  border: 0;
  outline: 0;
  text-decoration: none;
`;
const CategoryButton = styled.button`
  margin: 4px;
  border: 1px solid #d0d0d0;
  border-radius: 100px;
  padding: 3px 18px;
  background-color: #fff;
  font-size: 15px;
  line-height: 34px;
  cursor: pointer;
  color: #454648;
`;
const KeyButton = styled.button`
  width: 83px;
  height: 40px;
  margin: 4px;
  border: 1px solid #d0d0d0;
  background-color: #fff;
  color: #454648;
  border-radius: 17px;
  padding: 3px 14px;
  font-size: 15px;
  line-height: 34px;
  outline: 0;
  text-decoration: none;
  cursor: pointer;
  align-items: center;
`;

const Cate = styled.div`
  margin-left: 30px;
  .activation {
    border: 1px solid #ef8585;
    background-color: #ef8585;
    font-weight: 700;
    color: #fff;
  }
`;
const Index = () => {
  useEffect(() => {
    const isLogined = window.sessionStorage.userInfo == null ? false : true;
    if (!isLogined) {
      alert('로그인이 필요합니다.');
      return (window.location.href = '/login');
    } else {
      const userInfo = JSON.parse(window.sessionStorage.userInfo);
      setRoominfo((previnfo) => ({
        ...previnfo,
        masterId: userInfo.userId,
      }));
    }
  }, []);
  const [swapleft, setSwapleft] = useState(true);
  // title(방 제목), purpose(필터링), password(비밀번호), notice(공지사항), endDate, hashTag(해시태그), maxUserCount(최대인원)
  const [inputTag, setInputTag] = useState('');
  const [toggleState, setToggleState] = useState(1);
  const [roominfo, setRoominfo] = useState({
    title: '',
    purpose: 'k-exam',
    notice: '',
    hashtag: [],
    endDate: new Date(), //'YYYY-MM-DD HH:MM:SS' 형식
    secret: 0,
    password: '',
    maxUserCount: '4',
    masterId: '',
  });
  const category = [
    {
      id: 1,
      name: '국가 고시',
      purpose: 'k-exam',
    },
    {
      id: 2,
      name: '독서',
      purpose: 'reading',
    },
    {
      id: 3,
      name: '수능',
      purpose: 'sat',
    },
    {
      id: 4,
      name: '어학',
      purpose: 'eng',
    },
    {
      id: 5,
      name: '자격증',
      purpose: 'cert',
    },
    {
      id: 6,
      name: '기타',
      purpose: 'order',
    },
  ];

  const onclick = (data) => {
    setToggleState(data.id);
    setRoominfo((previnfo) => ({
      ...previnfo,
      purpose: data.purpose,
    }));
  };
  const onChangehandler = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setRoominfo((previnfo) => ({
        ...previnfo,
        title: value,
      }));
    } else if (name === 'purpose') {
      setRoominfo((previnfo) => ({
        ...previnfo,
        purpose: value,
      }));
    } else if (name === 'hashtag') {
      setInputTag(value);
    } else if (name === 'notice') {
      setRoominfo((previnfo) => ({
        ...previnfo,
        notice: value,
      }));
    } else if (name === 'maxUserCount') {
      setRoominfo((previnfo) => ({
        ...previnfo,
        maxUserCount: value,
      }));
    } else if (name === 'password') {
      setRoominfo((previnfo) => ({
        ...previnfo,
        password: value,
      }));
    }
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = inputTag.trim();

    if (key === 'Enter' && trimmedInput.length && !roominfo.hashtag.includes(trimmedInput)) {
      e.preventDefault();
      setRoominfo((previnfo) => ({
        ...previnfo,
        hashtag: [...previnfo.hashtag, trimmedInput],
      }));
      setInputTag('');
    }
  };

  const deleteTag = (index) => {
    setRoominfo((previnfo) => ({
      ...previnfo,
      hashtag: previnfo.hashtag.filter((tag, i) => i !== index),
    }));
  };

  const onsubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!roominfo.title) {
        return alert('스터디룸 이름이 비어있으면 안됩니다');
      }
      const room = roominfo;
      var moment = require('moment');
      require('moment-timezone');
      //moment.tz.setDefault("Asia/Seoul");
      room.endDate = moment(room.endDate).tz('Asia/Seoul').format('YYYY-MM-DD 00:00:00');
      console.log(room.endDate);
      if (room.password) {
        room.secret = 1;
      }
      console.log(room);
      axios
        .post('/studyrooms', room)
        .then((response) => {
          console.log(response);
          alert('스터디룸 생성 성공!');
          return (window.location.href = '/');
        })
        .catch((error) => {
          console.log(error.toJSON());
          alert('input 입력이 잘못된것 같습니다.');
        });
    },
    [roominfo]
  );
  return (
    <div>
      <Topbar />
      <Container>
        <div className='page'>
          <Rowarea>
            <Label>스터디 이름</Label>
            <Input name='title' onChange={(e) => onChangehandler(e)} value={roominfo.title} />
          </Rowarea>
          <Rowarea>
            <Label>카테고리</Label>
            {/* 국가고시, 독서, 수능, 어학, 자격증, 기타 */}
            <Cate>
              {category.map((data) => (
                <CategoryButton
                  name={data}
                  className={toggleState === data.id ? 'activation' : ''}
                  onClick={() => onclick(data)}
                >
                  {data.name}
                </CategoryButton>
              ))}
            </Cate>
          </Rowarea>
          <Rowarea>
            <Label>종료기간</Label>
            <DateInput
              selected={roominfo.endDate}
              onChange={(date) =>
                setRoominfo((previnfo) => ({
                  ...previnfo,
                  endDate: moment(date)._d,
                }))
              }
              locale={ko}
              dateFormat='yyyy-MM-dd'
            />
          </Rowarea>
          <Rowarea>
            <Label>해시태그</Label>
            <div className='container'>
              {roominfo.hashtag.map((tag, index) => (
                <div className='tag'>
                  {'#' + tag}
                  <button onClick={() => deleteTag(index)}>x</button>
                </div>
              ))}
              <Input
                name='hashtag'
                placeholder='Enter a tag'
                onChange={(e) => onChangehandler(e)}
                onKeyPress={(e) => onKeyDown(e)}
                value={inputTag}
              />
            </div>
          </Rowarea>
          <Rowarea>
            <Label>공지사항</Label>
            <Input name='notice' onChange={(e) => onChangehandler(e)} value={roominfo.notice} />
          </Rowarea>
          <Rowarea>
            <Label>최대인원</Label>
            <Input
              name='maxUserCount'
              onChange={(e) => onChangehandler(e)}
              placeholder='최대인원은 8명까지 가능'
              value={roominfo.maxUserCount}
            />
          </Rowarea>
          <TabWrap>
            <KeyButton className={swapleft ? 'active' : ''} onClick={() => setSwapleft(true)}>
              공개방
            </KeyButton>
            <KeyButton className={!swapleft ? 'active' : ''} onClick={() => setSwapleft(false)}>
              비밀방
            </KeyButton>
          </TabWrap>
          {!swapleft && (
            <Rowarea>
              <Label>비밀번호</Label>
              <Input
                name='password'
                onChange={(e) => onChangehandler(e)}
                value={roominfo.password}
              />
            </Rowarea>
          )}
          <Rowarea>
            <Button style={{ marginTop: '40px' }} onClick={onsubmit}>
              스터디 생성
            </Button>
          </Rowarea>
        </div>
      </Container>
    </div>
  );
};

export default Index;

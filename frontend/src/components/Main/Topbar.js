import styled from 'styled-components';

import React, { useState } from 'react';

import logo from '../../images/SWith_logo2.svg';
import DM_icon from '../../images/DM_icon.png';
import search_icon from '../../images/search_gray.png';
import friend_icon from '../../images/heart_default.png';
import FriendModal from '../Follow/FriendModal';

const Topbar = () => {
  const isLogined = window.localStorage.userInfo == null ? false : true;
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  const onsearch = (e) => {
    e.preventDefault();
    if (search.length > 1) {
      window.location.href = `/?search=${search}`;
    } else {
      alert(`검색어는 2자 이상 필요합니다.`);
    }
  };
  const onLogout = (e) => {
    alert('로그아웃 하였습니다.');
    localStorage.removeItem('userInfo');
    return (window.location.href = '/');
  };

  return (
    <Bar>
      <Container>
        <Left>
          <a href="/">
            <img
              style={{
                maxHeight: '50px',
                height: '40px',
                width: '90px',
              }}
              src={logo}
              alt="logo"
            />
          </a>
          <Link>
            <a href="/">홈</a>
            <a href="/plan">학습관리</a>
            <a href="/comm">커뮤니티</a>
          </Link>
          <Search onSubmit={(e) => onsearch(e)}>
            <Inputdiv>
              <img
                style={{
                  height: '18px',
                  width: '18px',
                  padding: '0 12px',
                  verticalAlign: 'middle',
                }}
                src={search_icon}
                alt="search_icon"
              />
              <Input
                type="text"
                value={search}
                placeholder="스터디 검색"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Inputdiv>
          </Search>
        </Left>
        <Right>
          <a className="rLink" href="/MakeRoom">
            스터디 만들기
          </a>

          <img
            style={{ height: '25px', width: '25px', padding: '5.5px', cursor: 'pointer' }}
            src={friend_icon}
            alt="friend_icon"
            onClick={closeModal}
          />
          {modalVisible && <FriendModal closeModal={closeModal}></FriendModal>}
          {/* <a href="/dm">
            <img
              style={{ height: '20px', width: '20px', padding: '8px' }}
              src={DM_icon}
              alt="DM_icon"
            />
          </a> */}
          {!isLogined ? (
            <a href="/login" className="login">
              로그인
            </a>
          ) : (
            <div style={{ gap: '15px', display: 'flex' }}>
              <a href="/profile" className="rLink">
                프로필
              </a>
              <button
                style={{
                  border: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
                className="rLink"
                onClick={onLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </Right>
      </Container>
    </Bar>
  );
};

export default Topbar;

const Bar = styled.div`
  width: 100%;
  background: #ffffff;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  min-width: max-content;
`;

const Container = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  border: 1px solid #cccccc;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 60%;
`;

const Link = styled.ul`
  //margin: 0 auto;
  display: flex;
  align-items: center;
  width: 30%;
  justify-content: space-between;
  min-width: max-content;
  //gap: 5px;

  a {
    width: max-content;
    font-size: 17px;
    font-weight: 400;
    font-family: 'Roboto';
    color: #828282;
    text-decoration: none;
    display: block;
  }
`;
const Search = styled.form`
  display: flex;
  align-items: center;
`;
const Inputdiv = styled.div`
  width: 240px;
  height: 40px;
  border-radius: 30px;
  border: 1px solid #eee;
  align-items: center;
  text-align: center;
`;
const Input = styled.input`
  padding: 11px 0 11px 22px;
  border: white;
  font-size: 14px;
  font-family: 'Roboto';
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  align-items: center;
  gap: 15px;

  /* Inside Auto Layout */
  flex: none;
  flex-grow: 0;
  .login {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px 10px;
    position: static;
    width: 70px;
    height: 33px;
    left: 0px;
    top: 3.5px;
    /* primary */

    background: #ef8585;
    border-radius: 100px;

    /* Inside Auto Layout */
    font-family: 'Roboto';
    flex: none;
    order: 0;
    flex-grow: 0;
    font-size: 17px;
    line-height: 20px;
    text-decoration: none;
    color: #fafafa;
  }
  .rLink {
    font-size: 17px;
    font-family: Roboto;
    color: #ef8585;
    font-weight: 700;
    text-decoration: none;
    padding: 0 6px;
    margin: 0 3px;
  }
`;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../api/defaultaxios";
import { Link } from "react-router-dom";

import StudyCard from "./StudyCard";
import studyImage from "../../images/studyImage.jpg";
import "./bottomPage.css";

const Bottompage = styled.div`
  padding: 70px 20px 0;
  width: 1200px;
  margin: 0 auto;
`;
const category = [
  {
    id: 1,
    name: "전체",
  },
  {
    id: 2,
    name: "국가 고시",
  },
  {
    id: 3,
    name: "독서",
  },
  {
    id: 4,
    name: "수능",
  },
  {
    id: 5,
    name: "어학",
  },
  {
    id: 6,
    name: "자격증",
  },
  {
    id: 7,
    name: "기타",
  },
];
const LinkContainer = styled.div`
  width: calc(20% - 16px);
  margin: 8px;
  height: auto;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 0px;
  text-align: left;
`;
const BottomPage = () => {
  const [NickName, setNickName] = useState("");
  const [studyNum, setStudyNum] = useState(0);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    console.log(index);
    setToggleState(index.id);
  };

  const getStudyTitleHashtag = () => {
    let roomInfo = [];
    axios
      .get("/studyrooms")
      .then((response) => {
        const datas = response.data.data;
        console.log(datas);
        datas.map((data) => {
          roomInfo = roomInfo.concat({
            id: data.id,
            title: data.title,
            hashtags: data.hashtags,
            purpose: data.purpose,
          });
          setPosts(roomInfo);
          setStudyNum(roomInfo.length);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const isLogined = window.sessionStorage.userInfo == null ? false : true;
    if (isLogined) {
      const session = JSON.parse(window.sessionStorage.userInfo);
      axios
        .get(`/users/${session.userId}`)
        .then((response) => {
          const data = response.data;
          //console.log(data);
          if (data.status === "200" && data.message === "OK") {
            setNickName(data.data.nickname);
          }
        })
        .catch((error) => {
          console.log(error.toJSON());
        });
    } else {
      setNickName("UNKNOWN");
    }
    getStudyTitleHashtag();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Bottompage>
      <div className="StudiesContainer">
        <div className="StudiesHeader">
          <div className="StudiesHeaderTitle">
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "700",
                lineHeight: "30px",
              }}
            >
              스터디 목록
            </h3>
            <div className="StudiesHeaderNum">총 {studyNum} 개 스터디</div>
          </div>
        </div>

        <div className="StudiesTabWrap">
          <div className="StudiesTabListWrap">
            {/* {tempStudyRoom()} */}
            {/* {StudyRoomSearch()} */}
            {category.map((data) => (
              <button
                className={
                  toggleState === data.id
                    ? "StudiesButtonActive"
                    : "StudiesButton"
                }
                onClick={() => toggleTab(data)}
              >
                {data.name}
              </button>
            ))}
          </div>
        </div>

        <div className="StudyCardWrap">
          {currentPosts.map((data) => {
            return (
              <LinkContainer>
                  <StudyCard
                    title={data.title}
                    imgUrl={studyImage}
                    body={data.hashtags}
                    studyRoomID={data.id}
                    nickName={NickName}
                  ></StudyCard>
              </LinkContainer>
            );
          })}
        </div>
        <nav>
          {pageNumbers.map((number) => {
            return (
              <button className="Pagebutton" onClick={() => paginate(number)}>
                {number}
              </button>
            );
          })}
        </nav>
      </div>
    </Bottompage>
  );
};

export default BottomPage;

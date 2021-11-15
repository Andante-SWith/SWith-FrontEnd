import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../api/defaultaxios";
import { Link } from "react-router-dom";

import StudyCard from "./StudyCard";
import studyImage from "../../images/studyImage.jpg";
import exampleList from "./exampleList.json";
import "./bottomPage.css";

const Bottompage = styled.div`
  padding: 70px 20px 0;
  width: 1200px;
  margin: 0 auto;
`;
const category = [
  {
    id: 1,
    purpose: "전체",
  },
  {
    id: 2,
    purpose: "국가 고시",
  },
  {
    id: 3,
    purpose: "독서",
  },
  {
    id: 4,
    purpose: "수능",
  },
  {
    id: 5,
    purpose: "어학",
  },
  {
    id: 6,
    purpose: "자격증",
  },
  {
    id: 7,
    purpose: "기타",
  },
];
const LinkContainer = styled.div`

  width: calc(20% - 16px);
  margin: 8px;
  height: auto;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  overFlow : hidden;
  border:0px;
  text-align: left;
`
const BottomPage = () => {
  
  const [NickName, setNickName] = useState('');
  const [studyNum, setStudyNum] = useState(0);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const [studyTitle, setStudyTitle] = useState("스윗 스터디룸");
  const addStudyTitle = () => {
    

    //later
  };
  const [studyHashtag, setStudyHashtag] = useState("#스윗 #SWith");
  const addStudyHashtag = () => {
    //later
    
  };

  const getStudyTitleHashtag = () => {
    let roomInfo = [];
    axios
      .get("/studyrooms")
      .then((response) => {
        const datas = response.data.data;
        console.log(datas);
        datas.map((data)=>{
          roomInfo = roomInfo.concat({
            id:data.id,
            title : data.title,
            hashtags : data.hashtags,
          })
          setPosts(roomInfo);
        })
        
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;



  useEffect(() => {

    getStudyTitleHashtag();

    setStudyNum(exampleList.data.length);
  }, []);
  
  useEffect(() => {
    const isLogined = window.sessionStorage.userInfo == null ? false : true;
    if (isLogined) {
      const session = JSON.parse(window.sessionStorage.userInfo);
      axios
        .get(`/users/${session.userId}`)
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (data.status === "200" && data.message === "OK") {
            setNickName(data.data.nickname);
          }
        })
        .catch((error) => {
          console.log(error.toJSON());
        });
    }
    else{
      setNickName('UNKNOWN')
    }
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
                onClick={() => toggleTab(data.id)}
              >
                {data.purpose}
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
  // useEffect(() => {
  //   axios
  //     .get("/studyrooms")
  //     .then((response) => {
  //       const datas = response.data.data;
  //       // //const tempStudyRoom
  //       // datas.map((data) => {
  //       //   tempStudyRoom = tempStudyRoom.concat(
  //       //     {
  //       //       id:data,

  //       //     }
  //       //   )
  //       // }
  //       // );
        
  //       console.log(datas);
  //     })
  //     .catch((error) => {
  //       console.log(error.toJSON());
  //     });
  // }, []);
  // "title": "스윗 스터디룸",
  // "body" : "#스윗 #SWith"
  //스터디룸 아이디 추가

  // const tempStudyRoom = ()=>{
  /*
    useEffect(()=>{
    const day = new Date(2021,12,20).toISOString().substring(0,19);
    axios
    .post("/studyrooms", {
      title: 'swithTest5', 
      purpose:'study..', 
      password:'', 
      secret: '0',
      notice:'notice', 
      endDate:'2021-12-05 00:00:00', 
      hashtags:"[]"
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
      if (data.status === "200" && data.message === "OK") {
        // alert("스터디룸 생성");
        console.log("스터디룸 생성");
      }
    })
    .catch((error) => {
      console.log(error.toJSON());
      //alert("오류");
    });
  }, []);
  */

  // };
  //const StudyRoomSearch = ()=>{
    // const day = new Date(2021,12,20).toISOString().substring(0,19);
    // axios
    // .get("/studyrooms", {
    // })
    // .then((response) => {
    //   const data = response.data;
    //   console.log(data);
    //   console.log("성공");
    //   if (data.status === "200" && data.message === "OK") {
    //     //alert("스터디룸 조회");
        
    //   }
    // })
    // .catch((error) => {
    //   console.log(error.toJSON());
    //   alert("오류");
    // });
 // };
  // const RoomEnter =()=>{
  //   nickName: nickName,
  //   studyRoomId: studyRoomId

  // }
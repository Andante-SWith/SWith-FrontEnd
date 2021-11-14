import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../api/defaultaxios";

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

const BottomPage = () => {
  

  const [studyNum, setStudyNum] = useState(0);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const [studyTitle, setStudyTitle] = useState("스윗 스터디룸");
  const addStudyTitle = () => {
    

    //later 배열에 넣고 빼내기
  };
  const [studyHashtag, setStudyHashtag] = useState("#스윗 #SWith");
  const addStudyHashtag = () => {
    // axios
    //   .get("/studyrooms")
    //   .then((response) => {
    //     const datas = response.data
    //     console.log(datas);
    //     datas.map((data)=>{
    //       roomHashtag = roomHashtag.concat({
    //         hashTag : data.hashTag,
    //       })
    //       setStudyHashtag(roomHashtag);
    //     })
        
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
            title : data.title,
            hashtag : data.hashtags,
          })
          setPosts(roomInfo.reverse());
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
    axios
      .get("/studyrooms")
      .then((response) => {
        const datas = response.data.data;
        // //const tempStudyRoom
        // datas.map((data) => {
        //   tempStudyRoom = tempStudyRoom.concat(
        //     {
        //       id:data,

        //     }
        //   )
        // }
        // );
        
        console.log(datas);
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  }, []);
/*
  useEffect(() => {
    setPosts(exampleList.data);
    getStudyTitleHashtag();

    setStudyNum(exampleList.data.length);
  }, []);
  // "title": "스윗 스터디룸",
  // "body" : "#스윗 #SWith"
  //스터디룸 아이디 추가
  const hash = ['study','swith'];
  // const tempStudyRoom = ()=>{
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
              <StudyCard
                title={data.title}
                imgUrl={studyImage}
                body={data.body}
              ></StudyCard>
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

import './css/PostList.css';
import styled from 'styled-components';

import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { getBoards, getBoardPost, deleteBoard } from '../../api/APIs';

import writeIMG from '../../images/write.png';

const PostList = ({ location, match }) => {
  const [post, setPost] = useState([]);
  const query = queryString.parse(location.search);
  const boardId = match.params.boardId;
  const boardTitle = match.params.boardTitle;
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const isLogined = window.localStorage.userInfo == null ? false : true;
    if (isLogined) {
      const local = JSON.parse(window.localStorage.userInfo);
      setUserEmail(local.name);
    }

    if (boardId == undefined) {
      getBoards()
        .then((response) => {
          const tempBoards = response.data.data;
          let boardsId = [];
          tempBoards.map((x) => {
            boardsId = boardsId.concat(x.id);
          });
          let tempPs = [];
          boardsId.map((x) => {
            if (query.search) {
              getBoardPost(x)
                .then((response) => {
                  const tempPosts = response.data.data;
                  tempPosts.map((tempPost) => {
                    if (
                      tempPost.title.toLowerCase().indexOf(query.search.toLowerCase()) !==
                      -1
                    ) {
                      tempPs = tempPs.concat(tempPost);
                    }
                  });
                  setPost(tempPs.sort((a, b) => getDateNum(a, b)));
                })
                .catch((error) => {
                  console.log(error.response);
                });
            } else {
              getBoardPost(x)
                .then((response) => {
                  const tempPosts = response.data.data;
                  tempPs = tempPs.concat(tempPosts);
                  setPost(tempPs.sort((a, b) => getDateNum(a, b)));
                })
                .catch((error) => {
                  console.log(error.response);
                });
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      getBoardPost(boardId)
        .then((response) => {
          const tempPosts = response.data.data;
          setPost(tempPosts.sort((a, b) => getDateNum(a, b)));
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  }, []);

  const [Selected, setSelected] = useState(0);

  const handleSelect = (e) => {
    setSelected(e.target.value);
    DoSort(e.target.value);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  let currentPosts = post.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(post.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const postsReturn = () => {
    return (
      <div style={{ width: '100%', minHeight: '520px' }}>
        {currentPosts.map((x) => {
          return (
            <div className="TextsWrap" style={{ borderTop: 'hidden' }}>
              <a href={`/comm/post/${x.board.id}/${x.id}`} className="TextLeftBox">
                {x.title}
              </a>
              <div className="TextCenterBox">{x.user.nickname}</div>
              <div className="TextCenterBox">{getKrDate(x.createdDate)}</div>
              <div className="TextCenterBox">{x.comments.length}</div>
              <div className="TextCenterBox">{x.viewCount}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const sortList = [
    { id: 0, lable: '?????????' },
    { id: 1, lable: '?????????' },
  ];
  const getDateNum = (a, b) => {
    const dateA = new Date(a.createdDate);
    const dateB = new Date(b.createdDate);

    return dateB - dateA;
  };
  const getKrDate = (date) => {
    let tempDate = new Date(date);
    tempDate.setHours(tempDate.getHours() + 9);
    return tempDate.toISOString().substring(0, 10);
  };

  const DoSort = (sortNum) => {
    if (sortNum == 1) {
      let tempPost = post;
      setPost(tempPost.sort((a, b) => b.viewCount - a.viewCount));
    } else if (sortNum == 0) {
      let tempPost = post;
      setPost(tempPost.sort((a, b) => getDateNum(a, b)));
    }
  };

  const getListTitle = () => {
    if (query.search) {
      return <div className="PostListTitle">{`'${query.search}'??? ????????????`}</div>;
    } else if (boardId == undefined) {
      return <div className="PostListTitle">????????? ??????</div>;
    } else {
      return <div className="PostListTitle">{boardTitle}</div>;
    }
  };

  const AdminDeleteBoard = () => {
    if (window.confirm(`${boardTitle}??? ?????? ?????????????????????????`)) {
      deleteBoard(boardId)
        .then((response) => {
          window.location.href = '/comm';
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="PostListWrap">
        <div className="PostListHeader">
          {query.search ? (
            <div className="PostListTitle">{`'${query.search}'??? ????????????`}</div>
          ) : boardTitle ? (
            <div className="PostListTitle">
              {boardTitle}
              <ChangeButton
                style={
                  userEmail === 'admin@swith.ml'
                    ? { marginLegt: '5px' }
                    : { display: 'none' }
                }
                onClick={AdminDeleteBoard}
              >
                ??????
              </ChangeButton>
            </div>
          ) : (
            <div className="PostListTitle">????????? ??????</div>
          )}
        </div>
        <div className="HeaderWrap">
          <div className="SortWrap">
            <select
              onChange={handleSelect}
              defaultValue={0}
              value={Selected}
              style={{ fontFamily: 'Roboto' }}
            >
              {sortList.map((data) => (
                <option value={data.id} key={data.id}>
                  {data.lable}
                </option>
              ))}
            </select>
          </div>
          <div
            className="TextsWrap"
            style={{ border: 'solid 2px #ccc', backgroundColor: '#f2f2f2' }}
          >
            <div className="TextBlackBox" style={{ width: '48%', marginLeft: '30px' }}>
              ????????? ??????
            </div>
            <div className="TextBlackBox">????????? </div>
            <div className="TextBlackBox">?????????</div>
            <div className="TextBlackBox">?????????</div>
            <div className="TextBlackBox">?????????</div>
          </div>
        </div>
        {postsReturn()}
        <div className="buttonWrap">
          <nav>
            {pageNumbers.map((number) => {
              return (
                <button
                  className={currentPage === number ? 'PagebuttonActive' : 'Pagebutton'}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              );
            })}
          </nav>
          <a href="/comm/CreatePost" className="button">
            <img src={writeIMG} alt="writeIMG" />
            <div>?????????</div>
          </a>
        </div>
      </div>
    </>
  );
};

const ChangeButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: skyblue;
`;

export default PostList;

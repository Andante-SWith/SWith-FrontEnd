import React from "react";
import styled from "styled-components";
import UserimgUrl from "../../images/default_profile_Image.png";
import CommentIcon from "../../images/comment_icon.png";
import ViewsIcon from "../../images/views_icon.png";
const Container = styled.div`
  border: 1px solid #e4e6eb;
  padding: 30px 45px 30px 45px;
`;
const Header = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e6eb;
`;
const Title = styled.div`
  margin-bottom: 6px;
  font-size: 13px;
  h3 {
    font-size: 22px;
    color: #454648;
  }
`;
const Info = styled.div`
  margin-top: 6px;
  display: flex;
`;
const Divimg = styled.div`
  margin-right: 10px;
  width: 40px;
  height: 40px;
`;

const Body = styled.div`
  min-height: 400px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e4e6eb;
`;
const Comment = styled.div`
  margin: 12px 0 29px;
  padding: 16px 10px 10px 18px;
  border: 2px solid #e4e6eb;
  border-radius: 6px;
  box-sizing: border-box;
  background: white;
  .inputarea {
    overflow: hidden;
    overflow-wrap: break-word;
    height: 17px;
    display: block;
    width: 100%;
    min-height: 17px;
    padding-right: 1px;
    border: 0;
    font-size: 13px;
    -webkit-appearance: none;
    resize: none;
    box-sizing: border-box;
    background: transparent;
    color: var(--skinTextColor);
    outline: 0;
  }
`;
const Post = () => {
  return (
    <Container>
      <Header>
        <Title>
          <a href="/comm/post">스터디 모집</a>
          <div style={{ marginTop: "7px" }}>
            <h3>함께 열심히 공부할 스터디원 모집합니다</h3>
          </div>
        </Title>
        <Info>
          <Divimg>
            <img
              src={UserimgUrl}
              alt="기본사용자이미지"
              width="40"
              height="40"
            />
          </Divimg>
          <div>
            <div>사용자 이름</div>
            <div>
              <span style={{ marginRight: "10px" }}>2021.10.31 12:11</span>
              <span style={{ marginRight: "10px" }}>
                <img
                  src={CommentIcon}
                  alt="댓글이미지"
                  width="10"
                  height="10"
                />
                15
              </span>
              <span>
                <img
                  src={ViewsIcon}
                  alt="조회수이미지"
                  width="14"
                  height="10"
                />
                125
              </span>
            </div>
          </div>
        </Info>
      </Header>
      <Body>
        <div>게시글 내용</div>
      </Body>
      <div>
        <h3>댓글</h3>
        <Comment>
          <textarea
            placeholder="내용을 입력하세요"
            className="inputarea"
          ></textarea>
        </Comment>
      </div>
    </Container>
  );
};

export default Post;

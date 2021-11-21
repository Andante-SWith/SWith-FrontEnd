import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "../../api/defaultaxios";
import UserImage from "../../images/default_profile_Image.png";

const Container = styled.div`
  display: flex;
  min-height: 800px;
  text-align: left;
  align-items: center;
  flex-direction: column;
  margin-top: 120px;
`; //모든것의 바깥

const PictureTextWrap = styled.div`
  display: flex;
`;

const EditBoxWrap = styled.div`
  display: flex;
  min-height: 800px;
  text-align: left;
  align-items: center;
  flex-direction: column;
  margin-top: 70px;
`; //입력창+완료버튼

const TextB = styled.div`
  margin: 0 auto;
  font-family: Roboto;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #000;
  margin: 5px 0;
`;
const TextG = styled.div`
  margin: 0 auto;
  font-family: Roboto;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #595959;
  margin: 5px 0;
`; //기본 회색

const TextInputBox = styled.input`
  width: 400px;
  padding: 15px;
  background-color: white;
  border: 1px solid #828282;
  border-radius: 3px;
  font-size: 15px;
  font-weight: normal;
  font-family: Roboto;
  margin: 5px 0;
`;

const Button = styled.button`
  align-items: center;
  width: 80%;
  height: 48px;
  margin-top: 30px;
  background-color: #ef8585;
  font-size: 0.95rem;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  border: 0;
  outline: 0;
  text-decoration: none;
`; //폰트 15

//////

const EditProfilePictureWrap = styled.div`
  margin: 50px 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const EditProfilePicture = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 70%;
  overflow: hidden;
  margin: 20px;
`;

const EditProfilePictureImg = styled.div`
  img {
    width: auto;
    height: 150px;
    object-fit: cover;
  }
`;

const EditProfilePictureButton = styled.button`
  margin: 4px;
  border: 1px solid #ef7575;
  background-color: #ef8585;
  border-radius: 100px;
  padding: 3px 18px;
  font-size: 15px;
  line-height: 34px;
  cursor: pointer;
  h3 {
    color: #fff;
  }
`;

const Index = () => {
  //UI에 보여지는 value
  const UserimgUrl = UserImage;
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const session = JSON.parse(window.sessionStorage.userInfo);

  useEffect(() => {
    axios
      .get(`/users/${session.userId}`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.status === "200" && data.message === "OK") {
          const api_data = data.data;
          let user = {
            email: api_data.email,
            nickname: api_data.nickname,
          };
          setEmail(user.email);
          setNickname(user.nickname);
          setEditInfo((prevInfo) => ({
            ...prevInfo,
            nickname: user.nickname,
          }));
        }
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
  }, []);

  //Input으로 변경할 value
  const [editInfo, setEditInfo] = useState({
    nickname: "",
    beforePassword: "",
    password: "",
  });
  const [pwConfirm, setPwConfirm] = useState("");

  const onChangehandler = (e) => {
    const { name, value } = e.target;
    if (name === "PWconfirm") {
      setPwConfirm(value);
    } else {
      setEditInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const onsubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!editInfo.nickname) {
        alert("닉네임을 한 글자 이상 입력해야합니다");
        return;
      }
      if (!editInfo.beforePassword) {
        alert("비밀번호를 입력해야합니다");
        return;
      }
      if (editInfo.password !== pwConfirm) {
        alert("비밀번호 일치하는지 확인해주세요");
        return;
      }
      if (!editInfo.password) {
        axios
          .patch(`/users/${session.userId}`, {
            nickname: editInfo.nickname,
            beforePassword: editInfo.beforePassword,
            password: editInfo.beforePassword,
          })
          .then((response) => {
            alert("프로필 정보를 변경하였습니다.");
            window.location.reload();
          })
          .catch((error) => {
            console.log(error.toJSON());
            alert("프로필 정보 수정에 문제가 발생했습니다");
          });
      } else {
        axios
          .patch(`/users/${session.userId}`, editInfo)
          .then((response) => {
            alert("프로필 정보를 변경하였습니다.");
            window.location.reload();
          })
          .catch((error) => {
            console.log(error.toJSON());
            alert("프로필 정보 수정에 문제가 발생했습니다");
          });
      }
    },
    [editInfo, pwConfirm]
  );
  return (
    <Container>
      <PictureTextWrap>
        <EditProfilePictureWrap>
          <EditProfilePicture>
            <EditProfilePictureImg>
              <img src={UserimgUrl} alt="기본사용자이미지" />
            </EditProfilePictureImg>
          </EditProfilePicture>
          <EditProfilePictureButton>
            <h3>프로필 사진 변경</h3>
          </EditProfilePictureButton>
        </EditProfilePictureWrap>

        <EditBoxWrap>
          <form onSubmit={onsubmit}>
            <TextB style={{ marginBottom: "15px" }}>
              <h2>{email}</h2>
              <h3 style={{ fontSize: "20px" }}>{nickname}</h3>
            </TextB>
            <TextB>닉네임</TextB>
            <TextInputBox
              placeholder="닉네임"
              name="nickname"
              value={editInfo.nickname}
              onChange={(e) => onChangehandler(e)}
              style={{ margin: "5px 0 25px" }}
            />
            <TextB>비밀번호 변경</TextB>
            <TextG>현재 비밀번호</TextG>
            <TextInputBox
              name="beforePassword"
              value={editInfo.beforePassword}
              type="password"
              placeholder="기존 비밀번호를 입력하세요."
              onChange={(e) => onChangehandler(e)}
            />
            <TextG>새 비밀번호</TextG>
            <TextInputBox
              name="password"
              type="password"
              value={editInfo.password}
              onChange={(e) => onChangehandler(e)}
              placeholder="새로운 비밀번호를 입력하세요."
            />
            <TextG>비밀번호 확인</TextG>
            <TextInputBox
              name="PWconfirm"
              type="password"
              value={pwConfirm}
              onChange={(e) => onChangehandler(e)}
              placeholder="새로운 비밀번호를 한번 더 입력하세요."
            />
            {editInfo.password !== pwConfirm ? (
              <div style={{ textAlign: "right", color: "red" }}>
                비밀번호가 일치하지 않습니다
              </div>
            ) : (
              <div style={{ textAlign: "right", color: "green" }}>
                비밀번호가 일치합니다
              </div>
            )}
            <Button>프로필 설정 완료</Button>
          </form>
        </EditBoxWrap>
      </PictureTextWrap>
    </Container>
  );
};
export default Index;

import './StudyRoom.css';
import React, { useState, useEffect } from 'react';
import axios from '../../api/defaultaxios';
import { Link } from 'react-router-dom';

import searchGray from '../../images/search_gray.png';
import heartTrue from '../../images/heart_true.png';
import defaultProfile from '../../images/default_profile_Image.png';
import planner from '../../images/planner2.png';
import camera_true from '../../images/camera_default.png';
import camera_false from '../../images/camera_false.png';
import speaker_true from '../../images/speaker_default.png';
import speaker_false from '../../images/speaker_false.png';

const user = [
  {
    id: 1,
    name: '사용자',
  },
  {
    id: 2,
    name: '유저1',
  },
  {
    id: 3,
    name: '유저2',
  },
];

const isUser = (user) => {
  if (user.id != 1) {
    return (
      <>
        {/* <div className="ImgIcon" style={{height: 'auto'}}>
                    <img
                        style ={{width:'15px'}}
                        src={heartTrue}
                        alt="heartTrue"
                    />
                </div> */}
        <div className='ImgIcon' style={{ height: 'auto' }}>
          <img style={{ width: '15px' }} src={planner} alt='planner' />
        </div>
      </>
    );
  }
};

export const UserList = (
  userId,
  userNickName,
  connnectedUsers,
  setVideoMute,
  setAudioMute,
  userVideoMute,
  userAudioMute
) => {
  const [imUser, setImUser] = useState([]);
  const users = [
    {
      userId: userId,
      nickName: userNickName,
    },
  ];

  useEffect(() => {
    //console.log(connnectedUsers);
    // axios
    // .get(`/users/${session.userId}`)
    // .then((response) => {
    //   const data = response.data;
    //   console.log(data);
    //   if (data.status === "200" && data.message === "OK") {

    //     // setImUser({
    //     //     id:data.data.id,
    //     //     nickName:data.data.
    //     // })
    //   }
    // })
    // .catch((error) => {
    //   console.log(error.toJSON());
    // });
    setImUser(users.concat(connnectedUsers));
    //console.log(imUser)
    //console.log(connnectedUsers)
  }, [connnectedUsers]);

  const videoMute = (userSocketId) => {
    setVideoMute(userSocketId);
    console.log(userVideoMute.get(userSocketId));
    console.log(userVideoMute);
  };

  const audioMute = (userSocketId) => {
    setAudioMute(userSocketId);
    console.log(userAudioMute.get(userSocketId));
    console.log(userAudioMute);
  };

  return (
    <div className='UserListtWrap'>
      <div className='UserList'>
        <div className='rowContainer'>
          <div className='text' style={{ fontWeight: 'bold' }}>
            참여자 목록
          </div>
          <div className='text' style={{ fontSize: '12px' }}>
            {connnectedUsers.length + 1}/4
          </div>
        </div>
        <div className='rowContainer'>
          <div className='ImgIcon' style={{ height: 'auto' }}>
            <img style={{ width: '15px', backgroundColor: '' }} src={searchGray} alt='searchGray' />
          </div>
        </div>
      </div>
      <div className='List' style={{ overflow: 'auto' }}>
        {imUser.map((user, index) => {
          return (
            <div className='UserList'>
              <div className='rowContainer'>
                <div className='profile'>
                  <Link
                    to={{
                      pathname: `/profile/${user.userId}/other`,
                    }}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      style={{
                        height: '30px',
                        width: 'auto',
                        objectFit: 'cover',
                      }}
                      src={defaultProfile}
                      alt='defaultProfile'
                    />
                  </Link>
                </div>
                <div className='text' style={{ maxWidth: '140px', overflow: 'hidden' }}>
                  {user.nickName}
                </div>
              </div>
              <div className='rowContainer'>
                {index != 0 ? (
                  <>
                    <div className='ImgIcon' style={{ height: 'auto', cursor: 'default' }}>
                      <img
                        style={{ width: '15px' }}
                        src={!userVideoMute.get(user.socketId) ? camera_false : camera_true}
                        alt='camera_false'
                        onClick={() => videoMute(user.socketId)}
                      />
                    </div>
                    <div className='ImgIcon' style={{ height: 'auto', cursor: 'default' }}>
                      <img
                        style={{ width: '15px' }}
                        src={!userAudioMute.get(user.socketId) ? speaker_false : speaker_true}
                        alt='mic_false'
                        onClick={() => audioMute(user.socketId)}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {/* {isUser(user)} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

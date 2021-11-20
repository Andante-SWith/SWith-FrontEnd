import './StudyRoom.css';
import { useRef, useState, useEffect } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import socket from './utils/Socket';
import configs from './utils/configs.json';
import { Video } from './Video';
import { Chat } from './Chat';
import { StudyRoomModal } from './StudyRoomModal';
import axios from '../../api/defaultaxios';

import user_icon from '../../images/user_icon.png';
import camera_true from '../../images/camera_true.png';
import camera_false from '../../images/camera_false.png';
import mic_true from '../../images/mic_true.png';
import mic_false from '../../images/mic_false.png';
import speaker_true from '../../images/speaker_true.png';
import speaker_false from '../../images/speaker_false.png';
import user_invite from '../../images/user_invite.png';
import screen_false from '../../images/screen_false.png';
import screen_true from '../../images/screen_true.png';

import LeftBar from './LeftBar';
import { UserList } from './UserList';

const pc_config = {
  iceServers: [configs['stun-server'], configs['turn-server']],
};

let secTimer = 0;

const StudyRoom = ({ match }) => {
  const studyRoomId = match.params.studyRoomId;
  const userNickName = match.params.nickName;
  const userInfo = match.params.userInfo;

  const [connectedUserTimer, setConnectedUserTimer] = useState(new Map());
  const [studyTimer, setStudyTimer] = useState('00:00:00');
  const [timerID, setTimerID] = useState(null);

  const userVideoRef = useRef(null);
  const [connnectedUsers, setConnnectedUsers] = useState([]);
  const [PCs, setPCs] = useState(new Map());
  const [userMedia, setUserMedia] = useState(null);
  const [availableUserMedia, setAvailableUserMedia] = useState(false);
  const [RTCSenders, setRTCSenders] = useState(new Map());
  const [userVideoMute, setUserVideoMute] = useState(new Map());
  const [userAudioMute, setUserAudioMute] = useState(new Map());

  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [speaker, setSpeaker] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [PeopleNum, setPeopleNum] = useState();
  const [studyRoomInfo, setStudyRoomInfo] = useState([]);

  useBeforeunload(async (event) => {
    event.preventDefault();
    socket.disconnect();
    await postStatistics();
    window.localStorage.setItem('enteredStudyRoom', 'false');
    return 'Are you sure to close this tab?';
  });

  useEffect(() => {
    initSocket();

    axios
      .get(`/studyrooms/${studyRoomId}`)
      .then((response) => {
        const data = response.data;
        //console.log(data.data);
        setStudyRoomInfo({
          id: data.data.id,
          title: data.data.title,
        });
        //console.log(studyRoomInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const initSettings = (useUserVideo, availableUserVideo) => {
    if (availableUserVideo) setUserMedia(userVideoRef.current.srcObject);

    setMic(false);
    setCamera(useUserVideo);
    setAvailableUserMedia(availableUserVideo);

    socket.emit('join_room', {
      room: studyRoomId,
      userName: userNickName,
      userId: JSON.parse(userInfo)['userId'],
    });

    let timerID = setInterval(() => {
      secTimer += 1;
      let studyTimer = getTime(secTimer);
      connectedUserTimer.forEach((value, key) => {
        connectedUserTimer.set(key, value + 1);
      });

      setConnectedUserTimer(connectedUserTimer);
      setStudyTimer(studyTimer);
    }, 1000);

    setTimerID(timerID);
  };

  const getTime = (seconds) => {
    var hour =
      parseInt(seconds / 3600) < 10 ? '0' + parseInt(seconds / 3600) : parseInt(seconds / 3600);
    var min =
      parseInt((seconds % 3600) / 60) < 10
        ? '0' + parseInt((seconds % 3600) / 60)
        : parseInt((seconds % 3600) / 60);
    var sec = seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60;
    return hour + ':' + min + ':' + sec;
  };

  const postStatistics = () => {
    clearInterval(timerID);
    const userId = JSON.parse(userInfo)['userId'];
    const now = new Date();
    const today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    axios
      .post('/statistics', {
        userId: userId,
        studyTime: studyTimer,
        date: today,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const initSocket = () => {
    socket.on('all_users', (allUsers) => {
      let len = allUsers.length;

      for (let i = 0; i < len; i++) {
        createPeerConnection(allUsers[i].socketId, allUsers[i].userName, allUsers[i].userId);
        let pc = PCs.get(allUsers[i].socketId);

        if (pc) {
          pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
            .then((sdp) => {
              console.log('create offer success');
              pc.setLocalDescription(new RTCSessionDescription(sdp));
              socket.emit('offer', {
                sdp: sdp,
                offerSendID: socket.id,
                offerSendUserName: userNickName,
                offerSendUserId: JSON.parse(userInfo)['userId'],
                offerStudyTimer: secTimer,
                offerReceiveID: allUsers[i].socketId,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    });

    socket.on('getOffer', (data) => {
      console.log('get offer');
      console.log(data);
      let pc = createPeerConnection(data.offerSendID, data.offerSendUserName, data.offerSendUserId);
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(() => {
          console.log('answer set remote description success');
          pc.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true })
            .then((sdp) => {
              console.log('create answer success');
              pc.setLocalDescription(new RTCSessionDescription(sdp));
              socket.emit('answer', {
                sdp: sdp,
                answerSendID: socket.id,
                answerStudyTimer: secTimer,
                answerReceiveID: data.offerSendID,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        });
        setConnectedUserTimer(
          new Map(connectedUserTimer.set(data.offerSendID, data.offerStudyTimer))
        );
        setUserAudioMute(new Map(userAudioMute.set(data.offerSendID, true)));
        setUserVideoMute(new Map(userVideoMute.set(data.offerSendID, true)));
      }
    });

    socket.on('getAnswer', (data) => {
      console.log('get answer');
      let pc = PCs.get(data.answerSendID);
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        setConnectedUserTimer(
          new Map(connectedUserTimer.set(data.answerSendID, data.answerStudyTimer))
        );
        setUserAudioMute(new Map(userAudioMute.set(data.answerSendID, true)));
        setUserVideoMute(new Map(userVideoMute.set(data.answerSendID, true)));
      }
    });

    socket.on('getCandidate', (data) => {
      console.log('get candidate');
      let pc = PCs.get(data.candidateSendID);
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
          console.log('candidate add success');
        });
      }
    });

    socket.on('user_exit', (data) => {
      console.log('PCs.get(data.socketId)');
      PCs.get(data.socketId).close();
      PCs.delete(data.socketId);
      RTCSenders.delete(data.socketId);
      connectedUserTimer.delete(data.socketId);
      setConnnectedUsers((oldUsers) => oldUsers.filter((user) => user.socketId !== data.socketId));
    });
  };

  const createPeerConnection = (socketID, nickName, userId) => {
    let newPC = new RTCPeerConnection(pc_config);
    setPCs(new Map(PCs.set(socketID, newPC)));
    console.log(socketID);
    console.log(nickName);
    console.log(userId);
    if (userVideoRef.current.srcObject) {
      console.log('localstream add');

      userVideoRef.current.srcObject.getTracks().forEach((track) => {
        let rtcSender = newPC.addTrack(track, userVideoRef.current.srcObject);
        setRTCSenders(new Map(RTCSenders.set(socketID, rtcSender)));
      });
    } else {
      console.log('no local stream');
    }

    newPC.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('onicecandidate');
        socket.emit('candidate', {
          candidate: e.candidate,
          candidateSendID: socket.id,
          candidateReceiveID: socketID,
        });
      }
    };

    newPC.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    newPC.ontrack = (e) => {
      console.log('ontrack success');
      setConnnectedUsers((oldUsers) => oldUsers.filter((user) => user.socketId !== socketID));
      setConnnectedUsers((oldUsers) => [
        ...oldUsers,
        {
          socketId: socketID,
          nickName: nickName,
          userId: userId,
          stream: e.streams[0],
        },
      ]);
      console.log(connnectedUsers);
    };
    return newPC;
  };

  const videoMute = () => {
    if (!availableUserMedia) return;
    userVideoRef.current.srcObject
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCamera(!camera);
  };

  const audioMute = () => {
    if (!availableUserMedia) return;
    userMedia.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setMic(!mic);
  };

  const setVideoMute = (userSocketId) => {
    setUserVideoMute(new Map(userVideoMute.set(userSocketId, !userVideoMute.get(userSocketId))));
  };

  const setAudioMute = (userSocketId) => {
    setUserAudioMute(new Map(userAudioMute.set(userSocketId, !userAudioMute.get(userSocketId))));
  };

  const sharingScreen = () => {
    if (sharing) stopSharingScreen();
    else startSharingScreen();
  };

  const startSharingScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          if (userMedia && userVideoRef.current) userVideoRef.current.srcObject = userMedia;
          if (connnectedUsers.length > 0) {
            userMedia.getTracks().forEach((track) => {
              connnectedUsers.map((user) => {
                RTCSenders.get(user.socketId).replaceTrack(track);
              });
            });
          }
          setSharing(false);
        });

        if (connnectedUsers.length > 0) {
          stream.getTracks().forEach((track) => {
            connnectedUsers.map((user) => RTCSenders.get(user.socketId).replaceTrack(track));
          });
        }

        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        setSharing(true);
      })
      .catch((error) => {
        console.log(`getUserMedia error: ${error}`);
      });
  };

  const stopSharingScreen = () => {
    if (userVideoRef.current.srcObject)
      userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    else return;

    if (userVideoRef.current) userVideoRef.current.srcObject = userMedia;
    userMedia.getTracks().forEach((track) => {
      connnectedUsers.map((user) => RTCSenders.get(user.socketId).replaceTrack(track));
    });
    setSharing(false);
  };

  const SplitScreen = (PeopleNum) => {
    let Number = 1;
    if (PeopleNum > 1 && PeopleNum < 5) {
      Number = 2.8;
    } else if (PeopleNum > 4) {
      Number = 3.3;
    }
    return Number;
  };

  return (
    <div className='Container'>
      <LeftBar studyRoomId={studyRoomId} />

      <div className='RightWrap'>
        <div className='RoomTopBarContainer'>
          <div className='ImageContainer'>
            <p>{studyRoomInfo.title}</p>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img src={user_icon} alt='userIcon' style={{ width: '17px', height: 'auto' }} />
              <p>{connnectedUsers.length + 1}명</p>
              <p style={{ marginLeft: '10px' }}>Study Time: {studyTimer}</p>
            </div>
          </div>
          <div className='ImageContainer'>
            <img src={mic ? mic_true : mic_false} onClick={audioMute} alt='mic' />
            <img src={camera ? camera_true : camera_false} onClick={videoMute} alt='camera' />
            {/* <img src={speaker ? speaker_true : speaker_false} alt="speaker" /> */}
            <img src={sharing ? screen_true : screen_false} onClick={sharingScreen} />
            {/* <button onClick={postStatistics}></button> */}
          </div>
          <div
            style={{
              padding: '0 20px',
              marginRight: '20px',
            }}
          >
            <img src={user_invite} alt='userInvite' />
          </div>
        </div>

        <StudyRoomModal setInitSetting={initSettings} videoRef={userVideoRef}></StudyRoomModal>

        <div className='displaysWrap'>
          <div style={{ margin: '10px' }}>
            <div className='videosWrap'>
              <div
                className='videoGrid'
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'white',
                  height: 'calc(100%/' + SplitScreen(connnectedUsers.length + 1) + ')',
                  width: 'calc(100%/' + SplitScreen(connnectedUsers.length + 1) + ')',
                }}
              >
                <>
                  {/* <div style={{backgroundColor:"white",width:"100%",height:"20px"}}></div> */}
                  <video muted={true} autoPlay playsInline ref={userVideoRef}></video>
                  {userNickName} {studyTimer}
                </>
              </div>
              {connnectedUsers.map((user, index) => {
                return (
                  <div
                    className='videoGrid'
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      color: 'white',
                      height: 'calc(100%/' + SplitScreen(connnectedUsers.length + 1) + ')',
                      width: 'calc(100%/' + SplitScreen(connnectedUsers.length + 1) + ')',
                    }}
                  >
                    <Video
                      key={index}
                      nickName={user.nickName}
                      videoMuted={userVideoMute.get(user.socketId)}
                      audioMuted={userAudioMute.get(user.socketId)}
                      studyTime={getTime(connectedUserTimer.get(user.socketId))}
                      stream={user.stream}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='ListWrap'>
          {UserList(
            JSON.parse(userInfo)['userId'],
            userNickName,
            connnectedUsers,
            setVideoMute,
            setAudioMute,
            userVideoMute,
            userAudioMute
          )}
          <Chat userNickName={userNickName} />
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;

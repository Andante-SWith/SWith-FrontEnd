import './StudyRoom.css';
import { useRef, useState, useEffect } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import socket from './utils/Socket';
import configs from './utils/configs.json';
import { Video } from './Video';
import { Chat } from './Chat';

let senderMediaStream;
let senderScreenStream;
let currentStream;
let senderTrcak;

const pc_config = {
    iceServers: [configs['stun-server'], configs['turn-server']],
};

const StudyRoom = ({ match }) => {
    const userVideoRef = useRef(null);
    const [connnectedUsers, setConnnectedUsers] = useState([]);
    const [PCs, setPCs] = useState(new Map());
    const studyRoomId = match.params.studyRoomId;
    const userNickName = match.params.nickName;
    

    useBeforeunload(() => {
      window.localStorage.setItem("enteredStudyRoom", "false");
      return ("Are you sure to close this tab?")
    });

    useEffect(() => {        
        initSocket();

        console.log(window.sessionStorage);
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                if (userVideoRef.current) userVideoRef.current.srcObject = stream;

                senderMediaStream = stream;
                currentStream = stream;

                socket.emit('join_room', { room: studyRoomId, userName: userNickName });
            })
            .catch((error) => {
                console.log(`getUserMedia error: ${error}`);

                let stream = new MediaStream();
                if (userVideoRef.current) userVideoRef.current.srcObject = stream;

                senderMediaStream = stream;
                currentStream = stream;

                socket.emit('join_room', { room: studyRoomId, userName: userNickName });
            });
    }, []);

    const initSocket = () => {
        socket.on('all_users', (allUsers) => {
            let len = allUsers.length;
            for (let i = 0; i < len; i++) {
                createPeerConnection(allUsers[i].id, allUsers[i].userName);

                let pc = PCs.get(allUsers[i].id);

                if (pc) {
                    pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
                        .then((sdp) => {
                            console.log('create offer success');
                            pc.setLocalDescription(new RTCSessionDescription(sdp));
                            socket.emit('offer', {
                                sdp: sdp,
                                offerSendID: socket.id,
                                offerSendUserName: userNickName,
                                offerReceiveID: allUsers[i].id,
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
            let pc = createPeerConnection(data.offerSendID, data.offerSendUserName);
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
                                answerReceiveID: data.offerSendID,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            }
        });

        socket.on('getAnswer', (data) => {
            console.log('get answer');
            let pc = PCs.get(data.answerSendID);
            if (pc) {
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
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
            PCs.get(data.id).close();
            PCs.delete(data.id);
            setConnnectedUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
        });
    };

    const createPeerConnection = (socketID, nickName) => {
        let newPC = new RTCPeerConnection(pc_config);
        setPCs(new Map(PCs.set(socketID, newPC)));

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
            setConnnectedUsers((oldUsers) => oldUsers.filter((user) => user.id !== socketID));
            setConnnectedUsers((oldUsers) => [
                ...oldUsers,
                {
                    id: socketID,
                    nickName: nickName,
                    stream: e.streams[0],
                },
            ]);
        };

        if (currentStream) {
            console.log('localstream add');
            currentStream.getTracks().forEach((track) => {
                senderTrcak = newPC.addTrack(track, currentStream);
            });
        } else {
            console.log('no local stream');
        }

        return newPC;
    };

    const videoMute = () => {
        currentStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    const audioMute = () => {
        currentStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    };

    const startSharingScreen = () => {
        navigator.mediaDevices
            .getDisplayMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                stream.getVideoTracks()[0].addEventListener('ended', () => {
                    currentStream = senderMediaStream;
                    if (senderMediaStream && userVideoRef.current) userVideoRef.current.srcObject = senderMediaStream;
                    senderMediaStream.getTracks().forEach((track) => {
                        senderTrcak.replaceTrack(track);
                    });
                });

                stream.getTracks().forEach((track) => {
                    senderTrcak.replaceTrack(track);
                });

                if (userVideoRef.current) userVideoRef.current.srcObject = stream;
                senderScreenStream = stream;
                currentStream = stream;
            })
            .catch((error) => {
                console.log(`getUserMedia error: ${error}`);
            });
    };

    const stopSharingScreen = () => {
        if (senderScreenStream) senderScreenStream.getTracks().forEach((track) => track.stop());
        else return;
        if (userVideoRef.current) userVideoRef.current.srcObject = senderMediaStream;
        senderMediaStream.getTracks().forEach((track) => {
            senderTrcak.replaceTrack(track);
        });
    };

    const disconnectSocket = () => {
        socket.disconnect();
    };

    return (
        <div className="App">
            <header className="App-header"></header>
            <Chat userNickName={userNickName} />
            <div>
                <h1>Realtime communication with WebRTC</h1>
                <video muted autoPlay playsInline ref={userVideoRef}></video>
                <button onClick={videoMute}>video mute</button>
                <button onClick={audioMute}>audio mute</button>
                <button onClick={startSharingScreen}>display sharing start</button>
                <button onClick={stopSharingScreen}>display sharing stop</button>
                <button onClick={disconnectSocket}>disconnect socket</button>
                {connnectedUsers.map((user, index) => {
                    return <Video key={index} nickName={user.nickName} stream={user.stream} />;
                })}
            </div>
        </div>
    );
};

export default StudyRoom;

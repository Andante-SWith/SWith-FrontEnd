var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    path: '/signaling/socket.io'
});

let users = new Map();
let socketToRoom = new Map();
const maximum = 8;

io.on('connection', socket => {
    socket.on('join_room', data => {
        if (users[data.room]) {
            const length = users[data.room].length;
            if (length === maximum) {
                socket.to(socket.id).emit('room_full');
                return;
            }
            users[data.room].push({socketId: socket.id, userName: data.userName, userId: data.userId});
        } else {
            users[data.room] = [{socketId: socket.id, userName: data.userName, userId: data.userId}];
        }
        socketToRoom[socket.id] = data.room;

        socket.join(data.room);
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

        const usersInThisRoom = users[data.room].filter(user => user.socketId !== socket.id);

        console.log(usersInThisRoom);

        io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
    });

    socket.on('offer', data => {
        socket.to(data.offerReceiveID).emit('getOffer', {sdp: data.sdp, offerSendID: data.offerSendID, offerSendUserName: data.offerSendUserName, offerSendUserId: data.offerSendUserId, offerStudyTimer: data.offerStudyTimer });
    });

    socket.on('answer', data => {
        socket.to(data.answerReceiveID).emit('getAnswer', {sdp: data.sdp, answerSendID: data.answerSendID, answerStudyTimer: data.answerStudyTimer});
    });

    socket.on('candidate', data => {
        socket.to(data.candidateReceiveID).emit('getCandidate', {candidate: data.candidate, candidateSendID: data.candidateSendID});
    })

    socket.on('chatting', (data) => {
        console.log(data);
        const room = socketToRoom[data.messageSendID];
        users[room].map(user => {
            socket.to(user.socketId).emit('chatting', data);
        })
    });

    socket.on('disconnect', () => {
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.socketId !== socket.id);
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                return;
            }
        }
        socket.to(roomID).emit('user_exit', {socketId: socket.id});
        console.log(users);
    })
});


server.listen(3001, function() {
    console.log('Listening on http://localhost:3001/');
  });
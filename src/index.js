const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage } = require('./utils/message');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

//options
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = socketio(server);

//Direction
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));


//new connection Hundler
io.on("connection", (socket) => {
    console.log("New SocketIo Connnection");

    socket.on('join', ({username, room}, cb) => {

        const { error, user } = addUser({id: socket.id, username, room});

        if ( error ){ 
            return cb(error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage(user.username ,"Welcome!"));
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username,`${user.username} has Joined!`));
        io.to(user.room).emit('roomData', { 
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        cb();
    })


    //send message handler
    socket.on('sendMessage', (message, cb) => {
        const filter = new Filter();
        const user = getUser(socket.id);
        if (filter.isProfane(message)) {
            return cb('Profanity Not Allowed!!');
        }
        io.to(user.room).emit('message', generateMessage(user.username,message));
        cb('Delivered!');
    })

    //send Location Handler
    socket.on('sendLocation', (position, cb) => {
        const user = getUser(socket.id);
        let template = `<a href="Https://google.com/maps?q=${position.lat},${position.long}" target="_blank">My Location</a>`;
        io.to(user.room).emit('message',generateMessage(user.username, template));
        cb('Location Has Delivered!');
    })

    //disconnect Hundler
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username, `${user.username} Has Left!`));
            io.to(user.room).emit('roomData', { 
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    })
})


//server
server.listen(port , () => {
    console.log('localhost/3000');
})
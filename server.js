const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessages = require('./utils/messages');
const { userJoin, getcurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
const io=socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect', socket => {
    
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message',formatMessages('Admin','Welcome to Chat App'));

        //user connects
        socket.broadcast.to(user.room).emit('message', formatMessages('Admin',`${user.username} has connected!`));

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        });
    });

    
    //user connects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        console.log(user);
        if(user) {
            io.to(user.room).emit('message', formatMessages('Admin',`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

    socket.on('chatMessage', msg => {
        const user = getcurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessages(user.username,msg));
    });

})


server.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
const io=socketio(server);

app.use(express.static(path.join(__dirname, 'public')));


io.on('connect', socket => {
 

    socket.emit('message','Welcome to Chat App');

    //user connects
    socket.broadcast.emit('message', 'A user has connected!');

    //user connects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

})


server.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});
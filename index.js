const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

//static serving
app.use(express.static(path.join(__dirname, 'dist')));

//manual catch all
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

const server = app.listen(3000);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('someone connected');

    socket.on("fwdPkt", data => {
        console.log(data);
        io.emit("pkt", data);
    });

    socket.on('disconnect', () => {
        console.log('someone disconnected');

    });
});

module.exports = io;
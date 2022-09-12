const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('index');
});
io.on('connection', (socket) => {
    console.log('a user connected');
    // console.log(socket.id);
    // console.log(socket.adapter.rooms);

    socket.on('create-room', (name) => {
        socket.join(name);
        socket.room = name;
        let rooms = [];
        socket.adapter.rooms.forEach((value, key, map) => {
            rooms.push(key);
        });
        io.sockets.emit('send-rooms', rooms);
        socket.emit('send-current-room', socket.room);
    });

    socket.on('user-chat', function (msg) {
        let data = socket.adapter.rooms.get(socket.room);
        let arr = [];
        if (data) {
            arr = Array.from(data);
        }
        // io.sockets.in(socket.room).emit('send-chat-me', msg);
        socket.emit('send-chat-me', msg);
        arr.map((id) => {
            if (socket.id !== id) {
                io.to(id).emit('send-chat-user-group', msg);
            }
        });
    });

    console.log(socket.adapter.rooms);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);

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

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);

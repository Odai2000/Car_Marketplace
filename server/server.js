require("dotenv").config();
const PORT = process.env.PORT || 3500;

// Core 
const http = require('http')

//Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

const server = http.createServer(app)

//socket.io 
const chatSocket = require("./sockets/chatSocket");
const authenticateSocket = require('./middleware/authenticateSocket')
const { Server } = require('socket.io');
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:8097", "http://192.168.1.101:8097"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

io.use(authenticateSocket)
io.on('connection', (socket) => {
  console.log('a user connected');
  chatSocket(io,socket)
});

//DB
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/connectDB");
connectDB();

//JWT
const jwt = require('jsonwebtoken')
const ACCESS_TOKEN_SECRET =process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

//CORS
const cors = require("cors");
const whitelist = ["http://localhost:8097","http://192.168.1.101:8097"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  credentials:true
};

app.use(bodyParser.json(), cookieParser(), cors(corsOptions));

//Routes
app.use("/", require("./routes/root"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));
app.use("/data",require("./routes/data"))
app.use("/chat",require("./routes/chat"))

mongoose.connection.once("open", () => {
  server.listen(PORT, () => console.log(`server running on port ${PORT}`));
});



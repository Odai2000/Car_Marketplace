require("dotenv").config();
const PORT = process.env.PORT || 3500;
//Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

//DB
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/connectDB");
connectDB();

//JWT
const jwt = require('jsonwebtoken')
ACCESS_TOKEN_SECRET =process.env.ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

//CORS
const cors = require("cors");
const whitelist = ["http://localhost:8097","http://192.168.1.111:8097"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials:true
};

app.use(bodyParser.json(), cookieParser(), cors(corsOptions));
//Routes
app.use("/", require("./routes/root"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));
app.use("/data",require("./routes/data"))

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

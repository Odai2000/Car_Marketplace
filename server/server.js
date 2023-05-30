require("dotenv").config();
const PORT = process.env.PORT || 3500;
//Express
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
//DB
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/connectDB");
connectDB();

app.use(bodyParser.json())
//Routes
app.use("/", require("./routes/root"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

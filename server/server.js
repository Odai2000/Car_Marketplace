require("dotenv").config();
const PORT = process.env.PORT || 3500;
//Express
const express = require("express");
const app = express();
//DB
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/connectDB");
connectDB();

//Routes
app.use("/", require("./routes/root"));
app.use("/user", require("./routes/user"));
app.use("/post", require("./routes/post"));

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

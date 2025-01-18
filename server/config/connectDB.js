const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true, // Automatically build indexes
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 24,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 128,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  emailVert: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  roles: 
    {
      type: [String],
      default: ["USER"],
    },
  
});

module.exports = mongoose.model("User", userSchema);

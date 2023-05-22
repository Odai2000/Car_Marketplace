const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minLength: 4,
    maxLength: 24,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    address: { type: String, require: true },
    vert: {type: Boolean, default:false}
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
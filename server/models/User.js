const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      validate: {
        validator: async function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
      },
    },
    emailVert: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
    },
    roles: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

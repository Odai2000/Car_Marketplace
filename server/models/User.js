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
    profileImageId: { type: String },
    status: {
      type: [String],
      enum: ["offline", "online", "soft_deleted"],
      default: ["offline"],
    },
    roles: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"],
    },
    savedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

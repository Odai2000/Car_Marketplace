const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rate: { type: Number, required: true },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
});

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
    ratings: [ratingSchema],
    reputation: {
      type: Number,
      default: 0,
    },

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
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("profileImageUrl").get(function () {
  return this.profileImageId?`${process.env.SERVER_URL}/files/${this.profileImageId}`:null;
});
userSchema.virtual("ratingCount").get(function () {
  return this.ratings?.length;
});

userSchema.pre("save", function (next) {
  const ratings = this.ratings || [];
  this.reputation =
    this.ratingCount === 0
      ? 0
      : ratings.reduce((sum, rating) => sum + rating.rate, 0) / this.ratingCount;
  next();
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  text: { type: String,
     required: true,
     maxLength: 1000 },  isDeleted: { type: Boolean,
     default: false },
  createdAt: { type: Date, default: Date.now },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } })
commentSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});
module.exports = mongoose.model("Comment", commentSchema);

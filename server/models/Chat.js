const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required:true,
    validate: {
      validator: function (array) {
        return array.length === 2;
      },
    },
  },
  messages: {
    type: [messageSchema],
  },
},{timestamps:true});

module.exports = mongoose.model('Chat',chatSchema)
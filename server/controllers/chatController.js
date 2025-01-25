const Chat = required("../models/Chat.js");
const { response } = require("express");
const asyncHandler = require("express-async-handler");

const getChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ participations: req.user._id }).exec();

    if (!chats.length === 0) return res.status(404).send({ message: "User has no chats." });

    res.status(200).send(chats);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

const getChat = asyncHandler(async (req, res) => {
  try {

    if (!req.body.peerId) {
        return res.status(400).send({ message: "Peer ID is required." });
      }

    const chat = await Chat.findOne({
      participations: { $all: [req.user._id, req.body.peerId] },
    }).exec();

    if (chat.length === 0)
      return res.status(404).send({ message: "User has no such chat." });

    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

const sendMessage = asyncHandler(async(req,res)=>{
    try {
        req.user
    } catch (error) {
        
    }
})

module.exports = {
    getChats,
    getChat
}
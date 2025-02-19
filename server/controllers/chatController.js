const Chat = require("../models/Chat");
const asyncHandler = require("express-async-handler");

const CloudStorageManager=require('../modules/cloud_storage/cloudStorageManager')
const cloudStorage = new CloudStorageManager("pcloud");

const getChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ participations: req.user._id })
      .populate({
        path: "participants",
        select: "name profileImageId email",
        match: { _id: { $ne: req.user._id } },
      })
      .exec();

    if (chats.length === 0) return res.status(200).send([]);

    const processedChats = await Promise.all(
      chats.map(async (item) => {
        const peerUser = item.participants[0];
        const profileImageUrl = await cloudStorage.download(
          peerUser.profileImageId
        );
        return {
          ...item.toObject(),
          peer: {
            peer_id: peerUser._id,
            name: peerUser.firstName + peer.lastName,
            profileImageUrl: profileImageUrl,
          },
        };
      })
    );
    res.status(200).send(processedChats);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

const getOrCreateChat = asyncHandler(async (req, res) => {
  try {
    const peerId = req.params.peer_Id;
    if (!peerId) {
      return res.status(400).send({ message: "Peer ID is required." });
    }

    let chat = await Chat.findOne({
      participations: { $all: [req.user._id, peerId] },
    }).exec();

    if (!chat) {
      chat = new Chat({
        participations: [req.user._id, peerId],
      });
      await chat.save();
    }

    res.status(200).send(chat);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = {
  getChats,
  getOrCreateChat,
};

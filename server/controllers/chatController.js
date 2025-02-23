const Chat = require("../models/Chat");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const CloudStorageManager = require("../modules/cloud_storage/cloudStorageManager");
const cloudStorage = new CloudStorageManager("pcloud");

const getChats = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id }).lean();

    if (chats.length === 0) return res.status(200).send([]);

    const processedChats = await Promise.all(
      chats.map(async (item) => {
        const peerId = item.participants.find(
          (id) => id.toString() !== req.user._id.toString()
        );

        const peerUser = await User.findById(peerId)
          .select("firstName lastName profileImageId")
          .lean();

        const profileImageUrl = await cloudStorage.download(
          peerUser.profileImageId
        );

        return {
          ...item,
          peer: {
            peer_id: peerUser._id,
            name: peerUser.firstName + peerUser.lastName,
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
      participants: { $all: [req.user._id, peerId] },
    }).lean();

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, peerId],
      });
      await chat.save();
    }

    const peerUser = await User.findById(peerId)
      .select("firstName lastName profileImageId")
      .lean();

    const profileImageUrl = await cloudStorage.download(
      peerUser.profileImageId
    );

    res.status(200).send({
      ...chat,
      peer: {
        peer_id: peerUser._id,
        name: peerUser.firstName + peerUser.lastName,
        profileImageUrl: profileImageUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = {
  getChats,
  getOrCreateChat,
};

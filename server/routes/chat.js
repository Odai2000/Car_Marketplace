const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const chatController = require("../controllers/chatController");


router.route("/").get(authenticateToken,chatController.getChats);

router.route("/:peer_Id").get(authenticateToken,chatController.getOrCreateChat);

module.exports = router;

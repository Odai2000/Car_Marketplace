const bidController = require("../controllers/bidController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")
const multer = require("multer");

const upload = multer({ dest: "temp/" });

router
  .route("/")
  .get(bidController.getBids)
  .post(authenticateToken, bidController.createBid)
  .patch(authenticateToken,bidController.updateBid)
  .delete(authenticateToken,bidController.deleteBid);


router.route("/user/:user_id/").get(bidController.getBidsByUserId);

module.exports = router;

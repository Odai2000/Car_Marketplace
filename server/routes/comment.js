const commentController = require("../controllers/commentController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")
const multer = require("multer");

const upload = multer({ dest: "temp/" });

router
  .route("/")
  .get(commentController.getComments)
  .post(authenticateToken, commentController.createComment)
  .patch(authenticateToken,commentController.updateComment)

  router.route("/:_id")
  .get(authenticateToken,commentController.getCommentsByUserId)
  .delete(authenticateToken,commentController.deleteComment);

router.route("/user/:user_id/").get(commentController.getCommentsByUserId);
router.route("/post/:post_id/").get(commentController.getCommentsByPostId);

module.exports = router;

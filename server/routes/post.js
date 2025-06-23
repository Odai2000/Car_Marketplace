const postController = require("../controllers/postController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")
const multer = require("multer");

const upload = multer({ dest: "temp/" });

router
  .route("/")
  .get(postController.getPosts)
  .post(authenticateToken,upload.array("images"), postController.createPost)
  .patch(authenticateToken,upload.array("images"),postController.updatePost)
  .delete(authenticateToken,postController.deletePost);

router.route("/:id").get(postController.getPostById);

router.route("/user/:user_id/").get(postController.getPostsByUserId);

module.exports = router;

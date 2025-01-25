const postController = require("../controllers/postController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateSocket")
const multer = require("multer");

const upload = multer({ dest: "temp/" });

router
  .route("/")
  .get(postController.getPosts)
  .post(authenticateToken,upload.array("images"), postController.createPost)
  .patch(authenticateToken,postController.updatePost)
  .delete(authenticateToken,postController.deletePost);

router.route("/:id").get(postController.getPostById);

module.exports = router;

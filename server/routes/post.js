const postController = require("../controllers/postController");
const express = require("express");
const router = express();

const multer = require("multer");

const upload = multer({ inMemory: true });

router
  .route("/")
  .get(postController.getAllPosts)
  .post(upload.array("imgs"), postController.createPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;

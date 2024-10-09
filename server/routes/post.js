const postController = require("../controllers/postController");
const express = require("express");
const router = express.Router();

const multer = require("multer");

const upload = multer({ inMemory: true });

router
  .route("/")
  .get(postController.getPosts)
  .post(upload.array("images"), postController.createPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

  
router.route("/:id").get(postController.getPostById);


module.exports = router;

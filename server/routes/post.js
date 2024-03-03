const postController = require('../controllers/postController')
const express = require('express')
const router = express()

router.route('/')
    .get(postController.getAllPosts)
    .post(postController.createPost)
    .patch(postController.updatePost)
    .delete(postController.deletePost)

module.exports = router

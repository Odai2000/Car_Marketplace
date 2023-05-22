const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().lean().exec();

  if (!posts.length) {
    return res.status(400).json({ message: "No Posts found." });
  }

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  //should car content be alone
  const { title, desc, user, car } = req.body;

  //confirm data
  if (!title || !user || !desc || !car) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const obj = { title, user, desc, car };

  const post = await Post.create(obj).lean().exce();

  if (!post) {
    return res.status(400).json({ message: "Invalid Data." });
  }

  res.status(201).json({ message: "Post created." });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, title, desc, user, car } = req.body;

  if (!id || !title || !desc || !user || !car) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const post = await Post.findById(id).lean().exec();

  if (!post) {
    return res.status(400).json({ message: `No post found with id: ${id}` });
  }

  post.title = title;
  post.desc = desc;
  post.user = user;
  post.car = car;

  const updatedPost = await post.save();
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const post = await Post.findById(id).lean().exec();

  if (!post) {
    return res
      .status(400)
      .json({ message: `No post with id: ${id} was found` });
  }
  const queryResult = await Post.deleteOne({ _id: id }).lean().exce();

  res.status(200).json({ message: `Post with id: ${id} has been deleted` });
});

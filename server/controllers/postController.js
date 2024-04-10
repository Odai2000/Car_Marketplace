const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.APPLICATION_KEY_ID,
  applicationKey: process.env.APPLICATION_KEY,
});

b2.authorize();

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().lean().exec();

  if (!posts.length) {
    return res.status(400).json({ message: "No Posts found." });
  }

  res.status(200).json(posts);
});

const getPosts = asyncHandler(async (req, res) => {
  const {
    make,
    model,
    yearRange,
    type,
    transmission,
    mileageRange,
    condition,
    color,
    engineType,
    hpRange,
    priceRange,
  } = req.query;

  const posts = await Post.find({
    "car.make": make,
    "car.model": model,
    "car.type": type,
    "car.year": { $gte: yearRange.min, $lte: yearRange.max },
    "car.transmission": transmission,
    "car.mileage": { $gte: mileageRange.min, $lte: mileageRange.max },
    "car.condition": condition,
    "car.color": { $in: color },
    "car.engineType": engineType,
    "car.hp": { $gte: hpRange.min, $lte: hpRange.max },
    "car.price": { $gte: priceRange.min, $lte: priceRange.max },
  });

  if (!posts.length) {
    return res.status(400).json({ message: "No Posts found." });
  }

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, desc, user, car } = req.body;
  const files = req.files;

  //confirm data
  if (!title  || !desc ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  //Upload images to cloud and store their Ids
  const imageIds = await uploadImages(files);

  //Add post to the DB
  const obj = { title, desc, imageIds };
  const post = await Post.create(obj)

  if (!post) {
    return res.status(400).json({ message: "Invalid Data." });
  }

  res.status(201).json({ message: "Post created." });
});

const updatePost = asyncHandler(async (req, res) => {
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

const uploadImages = asyncHandler(async (images) => {
  const imageIds = [];

  for (const image of images) {
    const uploadUrl = await b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });

    const uploadResponse = await b2.uploadFile({
      uploadUrl: uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName: image.originalname,
      data: image.buffer,
      contentType: image.mimetype,
      contentLength: 0,
      onUploadProgress: null,
    });

    imageIds.push(uploadResponse.data.fileId);
    console.log(uploadResponse.data.fileId);
  }
  return imageIds
});

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};

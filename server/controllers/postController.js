const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const B2 = require("backblaze-b2");

const b2 = new B2({
  applicationKeyId: process.env.APPLICATION_KEY_ID,
  applicationKey: process.env.APPLICATION_KEY,
});

//WIP
// const getPosts = asyncHandler(async (req, res) => {
//   const {
//     make,
//     model,
//     yearRange,
//     type,
//     transmission,
//     mileageRange,
//     condition,
//     color,
//     engineType,
//     hpRange,
//     priceRange,
//   } = req.query;

//   const posts = await Post.find({
//     "car.make": make,
//     "car.model": model,
//     "car.type": type,
//     "car.year": { $gte: yearRange.min, $lte: yearRange.max },
//     "car.transmission": transmission,
//     "car.mileage": { $gte: mileageRange.min, $lte: mileageRange.max },
//     "car.condition": condition,
//     "car.color": { $in: color },
//     "car.engineType": engineType,
//     "car.hp": { $gte: hpRange.min, $lte: hpRange.max },
//     "car.price": { $gte: priceRange.min, $lte: priceRange.max },
//   });

//   if (!posts.length) {
//     return res.status(400).json({ message: "No Posts found." });
//   }

//   res.status(200).json(posts);
// });

const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find().lean().exec();

    if (!posts.length) {
      return res.status(400).json({ message: "No Posts found." });
    }

    for (const post of posts) {
      if (post.imageIds) {
        const imagesUrls = (await getDownloadImagesUrl(post.imageIds)) || [];

        if (!imagesUrls) {
          return res.status(500);
        }
        delete post.imageIds;

        post.imagesUrls = imagesUrls;
      }
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

const createPost = asyncHandler(async (req, res) => {
  try {
    let { title, desc = "", user, car } = req.body;
    const files = req.files;
    car = JSON.parse(car);

    //confirm data
    if (!title || !user || !car) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageIds = [];
    if (files) {
      //Upload images to cloud and store their Ids
      imageIds = await uploadImages(files);
    }

    //Add post to the DB
    const obj = { title, desc, imageIds, car, user };
    const post = await Post.create(obj);

    if (!post) {
      return res.status(400).json({ message: "Invalid Data." });
    }

    return res.status(201).json({ message: "Post created." });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

const updatePost = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
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
  try {
    await b2.authorize();
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
    }
    return imageIds;
  } catch (error) {
    console.log(error);
    return null;
  }
});

const getDownloadImagesUrl = asyncHandler(async (imageIds) => {
  try {
    const auth = await b2.authorize();
    const urls = [];

    for (const imageId of imageIds) {
      urls.push({
        url: `${auth.data.downloadUrl}/b2api/v3/b2_download_file_by_id?fileId=${imageId}`,
        authorizationToken: auth.data.authorizationToken,
      });
    }

    return urls;
  } catch (error) {
    console.log(error);
    return null;
  }
});

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};

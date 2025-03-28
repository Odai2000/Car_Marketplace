const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const CloudStorageManager = require("../modules/cloud_storage/cloudStorageManager");
const cloudStorage = new CloudStorageManager("pcloud");

const getPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      return res.status(400).json({ message: "No Post found." });
    }

    if (post.imageIds) {
      const imagesUrls = [];

      for (const imageId of imageIds) {
        imagesUrls.push(await cloudStorage.download(imageId));
      }
      if (!imagesUrls) {
        return res.status(500);
      }
      delete post.imageIds;

      post.imagesUrls = imagesUrls;
    }

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

const getPosts = asyncHandler(async (req, res) => {
  const {
    make,
    model,
    yearMin,
    yearMax,
    bodyType,
    transmission,
    mileageMin,
    mileageMax,
    // condition, //suspended
    // colors = [],//suspended
    fuel,
    hpMin,
    hpMax,
    priceMin,
    priceMax,
  } = req.query;

  const query = {
    ...(make && { "car.make": { $regex: new RegExp(make, "i") } }),
    ...(model && { "car.model": { $regex: new RegExp(model, "i") } }),
    ...(bodyType && { "car.bodyType": { $regex: new RegExp(bodyType, "i") } }),
    ...(transmission && {
      "car.transmission": { $regex: new RegExp(transmission, "i") },
    }),
    ...(fuel && { "car.fuel": { $regex: new RegExp(fuel, "i") } }),
  };

  if (yearMin || yearMax) {
    query["car.year"] = {};
    if (yearMin) query["car.year"].$gte = parseInt(yearMin);
    if (yearMax) query["car.year"].$lte = parseInt(yearMax);
  }

  if (mileageMin || mileageMax) {
    query["car.mileage"] = {};
    if (mileageMin) query["car.mileage"].$gte = parseInt(mileageMin);
    if (mileageMax) query["car.mileage"].$lte = parseInt(mileageMax);
  }

  if (hpMin || hpMax) {
    query["car.hp"] = {};
    if (hpMin) query["car.hp"].$gte = parseInt(hpMin);
    if (hpMax) query["car.hp"].$lte = parseInt(hpMax);
  }

  if (priceMin || priceMax) {
    query["car.price"] = {};
    if (priceMin) query["car.price"].$gte = parseInt(priceMin);
    if (priceMax) query["car.price"].$lte = parseInt(priceMax);
  }

  const posts = await Post.find(query).lean();

  console.log(query);

  if (!posts.length) {
    return res.status(400).json({ message: "No Posts found." });
  }

  for (const post of posts) {
    const imageIds = post.imageIds;
    if (imageIds) {
      try {
        const imagesUrls = [];

        for (const imageId of imageIds) {
          imagesUrls.push(await cloudStorage.download(imageId));
        }
        delete post.imageIds;
        post.imagesUrls = imagesUrls;
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
  }

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  try {
    let { title, desc = "", car, price } = req.body;
    const user = req.user._id;

    const files = req.files;
    car = JSON.parse(car);

    //confirm data
    if (!title || !user || !car || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageIds = [];
    if (files) {
      //Upload images to cloud at specified folder and store their ids in the DB
      for (const file of files) {
        imageIds.push(await cloudStorage.upload(file, 14517807595));
      }

      console.log(imageIds);
    }

    //Add post to the DB
    const obj = { title, desc, imageIds, car, price, user };
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
    const { id, title, desc, user, car, price } = req.body;

    if (!id || !title || !desc || !user || !car || !price) {
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
    post.price = price;

    const updatedPost = await post.save();

    if (!updatedPost) {
      return res.status(400).send("Update failed");
    }

    res.status(201).send("Post updated.");
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

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

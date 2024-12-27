const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const pcloudSdk = require("pcloud-sdk-js");
const client = pcloudSdk.createClient(process.env.PCLOUD_ACCESS_TOKEN);

global.locationid = 2;

const getPostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      return res.status(400).json({ message: "No Post found." });
    }

    if (post.imageIds) {
      const imagesUrls = (await getDownloadImagesUrl(post.imageIds)) || [];

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
    body,
    transmission,
    mileageMin,
    mileageMax,
    condition,
    colors = [],
    engineType,
    hpMin,
    hpMax,
    priceMin,
    priceMax,
  } = req.query;

  client.listfolder(0).then((fileMetadata) => {
    console.log(fileMetadata);
  });
  const query = {
    ...(make && { "car.make": make }),
    ...(model && { "car.model": model }),
    ...(body && { "car.type": body }),
    ...(transmission && { "car.transmission": transmission }),
    ...(condition && { "car.condition": condition }),
    ...(colors.length && { "car.color": { $in: colors } }),
    ...(engineType && { "car.engineType": engineType }),
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
    if (post.imageIds) {
      try {
        const imagesUrls = (await getDownloadImagesUrl(post.imageIds)) || [];
        console.log("Fetched Image URLs:", imagesUrls);

        delete post.imageIds;
        post.imagesUrls = imagesUrls
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
      console.log(imageIds);
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
    const imageIds = [];

    for (const image of images) {
      const result = await client.upload(image.path, 0);
      console.log(result);
      if (result.metadata && result.metadata.fileid) {
        imageIds.push(result.metadata.fileid);
      }
    }

    return imageIds;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return null;
  }
});

module.exports = uploadImages;

const getDownloadImagesUrl = asyncHandler(async (imageIds) => {
  try {
    const urls = [];

    for (const imageId of imageIds) {
      urls.push(await client.getfilelink(imageId));
    }

    return urls;
  } catch (error) {
    console.log(error);
    return null;
  }
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

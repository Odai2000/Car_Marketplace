const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const CloudStorageManager = require("../modules/cloud_storage/cloudStorageManager");
const cloudStorage = new CloudStorageManager("pcloud");
const folderId = process.env.PCLOUD_FOLDER_ID;
const Bid = require("../models/Bid");
const Comment = require("../models/Comment");
const crypto = require("crypto");

const getPostById = asyncHandler(async (req, res) => {
  try {
    const { include, user_id } = req.query;
    const populateFields = [];
    let query = Post.findById(req.params.id);

    populateFields.push({
      path: "user",
      select: "firstName lastName name profileImageId ratings reputation",
    });

    if (include?.includes("bids")) {
      populateFields.push({
        path: "bids",
        options: { sort: { createdAt: -1 } },
        populate: { path: "user", select: "firstName lastName name" },
      });
    }

    if (include?.includes("comments")) {
      populateFields.push({
        path: "comments",
        match: { parent_id: null },
        options: { sort: { createdAt: -1 }, limit: 10 },
        populate: { path: "user", select: "firstName lastName name profileImageId" },
      });
    }

    if (populateFields.length > 0) {
      query = query.populate(populateFields);
    }
    const post = await query.exec();

    if (!post) {
      return res.status(404).json({ message: "No Post found." });
    }

    // count views

    const rawIp =
      req.headers["x-forwarded-for"]
        ?.split(",")[0]
        ?.trim()
        ?.replace("::ffff:", "") || req.ip?.replace("::ffff:", "");

    const viewer =
      user_id ||
      crypto
        .createHash("sha256")
        .update(rawIp || "")
        .digest("hex");

    if (!post.uniqueViewers?.includes(viewer)) {
      post.uniqueViewers.push(viewer);
      post.views += 1;
      await post.save({validateBeforeSave:false}); //cuz of unclean dataset
    }

    // prepares image urls for post photos, pfp and comments

    let postObject = post.toObject ? post.toObject() : post;
    if (postObject.imageIds && postObject.imageIds.length > 0) {
      postObject.images = [];
      for (const imageId of postObject.imageIds) {
        // const imageURL = await cloudStorage.download(imageId);

        postObject.images.push({
          imageId,
          imageURL: `${process.env.SERVER_URL}/files/${imageId}`,
        });
      }

      delete postObject.imageIds;
    }

    // for user profile image
    postObject.user.profileImageUrl = `${process.env.SERVER_URL}/files/${postObject?.user?.profileImageId}`;
    delete postObject?.user?.profileImageId;

    // for comments
   const comments= postObject.comments?.map((comment) => {
      if (comment?.user?.profileImageId) {
        comment.user.profileImageUrl = `${process.env.SERVER_URL}/files/${comment.user.profileImageId}`;
        delete comment.user.profileImageId;
      }
      return comment
    });

    postObject.comments=comments

    return res.status(200).json(postObject);
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

  if (!posts.length) {
    // return res.status(400).json({ message: "No Posts found." });
    return res.status(200).json(posts);
  }

  // populate post.images and remove remove post.imageIds
  for (const post of posts) {
    if (post.imageIds && post.imageIds.length > 0) {
      try {
        post.images = [];
        for (const imageId of post.imageIds) {
          const imageURL = await cloudStorage.download(imageId);

          post.images.push({
            imageId,
            imageURL: `${process.env.SERVER_URL}/files/${imageId}`,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
    delete post.imageIds;
  }

  res.status(200).json(posts);
});

const getPostsByUserId = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user_id: req.params.user_id })
    .sort({ createdAt: -1 })
    .lean();

  if (!posts.length) {
    return res.status(200).json(posts);
  }

  // populate post.images and remove remove post.imageIds
  for (const post of posts) {
    if (post.imageIds && post.imageIds.length > 0) {
      try {
        post.images = [];
        for (const imageId of post.imageIds) {
          const imageURL = await cloudStorage.download(imageId);

          post.images.push({
            imageId,
            imageURL: `${process.env.SERVER_URL}/files/${imageId}`,
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500);
      }
    }
    delete post.imageIds;
  }

  res.status(200).json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { title, desc = "", car, price, location } = data;
    const user_id = req.user._id;

    const files = req.files;

    //confirm data
    if (!title || !user_id || !car || !price || !location) {
      return res
        .status(400)
        .json({ message: "All fields are required" + user_id });
    }

    let imageIds = [];
    if (files) {
      //Upload images to cloud at specified folder and store their ids in the DB
      for (const file of files) {
        imageIds.push(await cloudStorage.upload(file, folderId));
      }
    }

    //Add post to the DB
    const obj = { title, desc, imageIds, car, location, price, user_id };
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
    const data = JSON.parse(req.body.data);
    const { _id, title, desc, car, price, location, imagesIdsToDelete } = data;
    const user_id = req.user._id;
    if (!_id || !title || !user_id || !car || !price || !location) {
      console.log("Received body:", {
        title: !!title,
        user_id: !!user_id,
        car: !!car,
        price: !!price,
        location: !!location,
        _id: !!_id,
        actualValues: { title, car, price, location, user_id },
      });
      return res.status(400).json({ message: "All fields are required" });
    }
    const post = await Post.findById(_id).exec();

    if (!post) {
      return res.status(404).json({ message: `No post found with id: $_{id}` });
    }

    if (
      req.user._id.toString() !== post.user_id.toString() &&
      !req.user.roles.includes("ADMIN")
    ) {
      return res.status(403).send("Forbidden");
    }

    post.title = title;
    post.desc = desc;
    post.user_id = user_id;
    post.car = car;
    post.price = price;
    post.location = location;

    const files = req.files;
    if (files) {
      //Upload images to cloud at specified folder and store their ids in the DB
      for (const file of files) {
        post.imageIds.push(await cloudStorage.upload(file, folderId));
      }
    }

    // remove images ids that match with deletion array and store them as valid ids for file deletion on cloud
    let validImageIds = [];

    if (imagesIdsToDelete && imagesIdsToDelete.length > 0) {
      post.imageIds = post.imageIds.filter((id) => {
        if (imagesIdsToDelete.includes(id)) {
          validImageIds.push(id);
          return false;
        }
        return true;
      });
    }

    const updatedPost = await post.save();

    if (!updatedPost) {
      return res.status(400).send("Update failed");
    }

    // delete files on cloud storage after update success
    if (validImageIds.length > 0) {
      await Promise.all(
        validImageIds.map((imageId) => cloudStorage.delete(Number(imageId)))
      );
    }
    res.status(200).send("Post updated.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

const deletePost = asyncHandler(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { _id } = data;
  const post = await Post.findById(_id).exec();

  if (!post) {
    return res
      .status(400)
      .json({ message: `No post with id: ${_id} was found` });
  }

  if (
    req.user._id.toString() !== post.user_id.toString() &&
    !req.user.roles.includes("ADMIN")
  ) {
    return res.status(403).send("Forbidden");
  }

  const result = await post.remove({ _id: _id });

  if (!result)
    return res
      .status(500)
      .json({ message: `Failed to delete post with ${_id}` });

  if (post.imageIds && post.imageIds.length > 0) {
    await Promise.all(
      post.imageIds.map(async (imageId) => {
        await cloudStorage.delete(Number(imageId));
      })
    );
    res.status(200).json({ message: `Post with id: ${_id} has been deleted` });
  }
});

module.exports = {
  getPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
};

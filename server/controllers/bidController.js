const Bid = require("../models/Bid");
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const getBids = asyncHandler(async (req, res) => {
  try {
    const bids = await Bid.find().lean();
    res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json(error);
  }
});

const getBidsByUserId = asyncHandler(async (req, res) => {
  try {
    const bids = await Bid.find({ user_id: req.params.user_id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids by user:", error);
    res.status(500).json(error);
  }
});

const createBid = asyncHandler(async (req, res) => {
  try {
    const { amount, post_id } = req.body;

    const user_id = req.user._id;

    // validate

    //confirm data
    if (!amount || !post_id || !user_id) {
      console.log("Received body:", {
        amount: !!amount,
        user_id: !!user_id,
        post_id: !!post_id,
      });

      return res.status(400).json({ message: "All fields are required" });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid input for amount" });
    }

    const post = await Post.findById(post_id).select("user_id").lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //Prevent users from bidding on their own posts
    if (user_id.toString() === post.user_id.toString()) {
      return res.status(403).json({
        message: "You cannot bid on your own post",
      });
    }

    //Add bid to the DB
    const bid = await Bid.create({ amount, post_id, user_id });

    // Populate user
    const populatedBid = await Bid.findById(bid._id)
      .populate({
        path: "user",
        select: "firstName lastName name profileImageId",
      })
      .exec();

    if (!bid) {
      return res.status(400).json({ message: "Invalid Data." });
    }
    //send notification
    const io = req.app.get("io");
    io.sendNotification({message:`${bid.user.name} offered $${bid.amount.toLocaleString()} for your vehicle.`,user_id:post.user._id,link:`/post/${post._id}`});
    return res.status(201).json({ message: "Bid created.", bid: populatedBid });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const updateBid = asyncHandler(async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { _id, amount } = data;
    const user_id = req.user._id;

    // validation

    if (!_id || !amount || !user_id) {
      console.log("Received body:", {
        amount: !!amount,
        user_id: !!user_id,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid input for amount" });
    }

    const bid = await Bid.findById(_id).exec();

    if (!bid) {
      return res.status(404).json({ message: `No bid found with id: ${_id}` });
    }

    if (req.user._id.toString() !== bid.user_id.toString()) {
      return res.status(403).send("Forbidden");
    }

    bid.amount = amount;

    const updatedBid = await bid.save();

    if (!updatedBid) {
      return res.status(400).send("Update failed");
    }

    res.status(200).json({ message: "Bid updated.", bid: bid });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const deleteBid = asyncHandler(async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { _id } = data;
    const bid = await Bid.findById(_id).exec();

    if (!bid) {
      return res
        .status(400)
        .json({ message: `No bid with id: ${_id} was found` });
    }

    if (req.user._id !== bid.user_id && !req.user.roles.includes("ADMIN")) {
      return res.status(403).send("Forbidden");
    }

    const result = await bid.deleteOne(_id).exec();

    if (!result)
      return res
        .status(500)
        .json({ message: `Failed to delete bid with ${_id}` });

    res.status(200).json({ message: `Bid with id: ${_id} has been deleted` });
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json(error);
  }
});

module.exports = {
  getBids,
  getBidsByUserId,
  createBid,
  updateBid,
  deleteBid,
};

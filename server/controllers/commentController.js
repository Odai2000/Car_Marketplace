const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const getComments = asyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find().lean();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json(error);
  }
});

const getCommentsByUserId = asyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({ user_id: req.params.user_id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by user:", error);
    res.status(500).json(error);
  }
});

const createComment = asyncHandler(async (req, res) => {
  try {
    const { text, post_id, parent_id } = req.body;
    const user_id = req.user._id;

    //confirm data
    if (!text || !post_id || !user_id) {
      console.log("Received body:", {
        text: !!text,
        user_id: !!user_id,
        post_id: !!post_id,
      });

      return res.status(400).json({ message: "All fields are required" });
    }

    //Add comment to the DB
    const comment = await Comment.create({ text, post_id, user_id, parent_id });

    if (!comment) {
      return res.status(400).json({ message: "Invalid Data." });
    }

    // Populate user
    const PopulatedComment = await Comment.findById(comment._id)
      .populate({
        path: "user",
        select: "firstName lastName name profileImageId",
      })
      .exec();
const post =await Post.findById(post_id).populate({
  path:"user",
   select: "firstName lastName name",
}).exec()
    const io = req.app.get("io");
    if(!io) throw new error("io failed.")
    io.sendNotification({
      message: `${PopulatedComment.user.name} commented on your post: "${comment.text}"`,
      user_id: post.user._id,
      link: `/post/${post._id}`,
    }); 
    return res
      .status(201)
      .json({ message: "Comment created.", comment: PopulatedComment });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Unexcepted server error.");
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { _id, text } = data;
    const user_id = req.user._id;

    // validation

    if (!_id || !text || !user_id) {
      console.log("Received body:", {
        text: !!text,
        user_id: !!user_id,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof text !== "number" || text <= 0) {
      return res.status(400).json({ message: "Invalid input for text" });
    }

    const comment = await Comment.findById(_id).exec();

    if (!comment) {
      return res
        .status(404)
        .json({ message: `No comment found with id: ${_id}` });
    }

    if (req.user._id.toString() !== comment.user_id.toString()) {
      return res.status(403).send("forbidden");
    }

    comment.text = text;

    const updatedComment = await comment.save();

    if (!updatedComment) {
      return res
        .status(400)
        .json({ message: "Update failed", comment: comment });
    }

    res.status(200).send("Comment updated.");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { _id } = data;
    const comment = await Comment.findById(_id).exec();

    if (!comment) {
      return res
        .status(400)
        .json({ message: `No comment with id: ${_id} was found` });
    }

    if (req.user._id !== comment.user_id && !req.user.roles.includes("ADMIN")) {
      return res.status(403).send("Forcommentden");
    }

    const result = await comment.deleteOne(_id).exec();

    if (!result)
      return res
        .status(500)
        .json({ message: `Failed to delete comment with ${_id}` });

    res
      .status(200)
      .json({ message: `Comment with id: ${_id} has been deleted` });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json(error);
  }
});

module.exports = {
  getComments,
  getCommentsByUserId,
  createComment,
  updateComment,
  deleteComment,
};

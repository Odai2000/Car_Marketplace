const Post = require("../models/Post");

const updatePostScores = async (req, res) => {
  try {
    if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const posts = await Post.find().populate("user");
    for (const post of posts) {
      post.score = post.calculateScore(); 
      await post.save();
    }

    res.status(200).json({ message: "scores updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cron job failed" });
  }
};


module.exports = {
updatePostScores
};

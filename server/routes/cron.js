const cronController = require("../controllers/cronController");
const express = require("express");
const router = express.Router();


router.route("/update-post-scores").post(cronController.updatePostScores);

module.exports = router;

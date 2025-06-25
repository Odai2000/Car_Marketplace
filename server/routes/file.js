const express = require("express");
const { streamFile } = require("../controllers/fileController");

const router = express.Router();

router.get("/:fileId", streamFile);

module.exports = router;
const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");
const CloudStorageManager = require("../modules/cloud_storage/cloudStorageManager");
const cloudStorage = new CloudStorageManager("pcloud");

// solution to stream files from server to bypass cloud 
const streamFile = asyncHandler(async (req, res) => {
  const { fileId } = req.params;

  const fileUrl= await cloudStorage.download(fileId);
  const upstream = await fetch(fileUrl);
  if (!upstream.ok) {
    return res.status(502).send("Failed to download file.");
  }

  upstream.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  upstream.body.pipe(res);
});

module.exports = { streamFile };
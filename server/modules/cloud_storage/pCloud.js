const asyncHandler = require("express-async-handler");
const CloudStorageInterface = require("./cloudStorageInterface");
const pcloudSdk = require("pcloud-sdk-js");
const fs = require("fs");

global.locationid = 2;

class PCloudStorage extends CloudStorageInterface {
  constructor() {
    super();
    this.client = pcloudSdk.createClient(process.env.PCLOUD_ACCESS_TOKEN);
  }

  upload = asyncHandler(async (file, folderId) => {
    try {
      const response = await this.client.upload(file.path, folderId);

      if (!response.metadata || !response.metadata.fileid) {
        console.log("Upload failed.");
      }

      fs.promises.unlink(file.path);
      return response.metadata.fileid;
    } catch (error) {
      console.error("An unexpected error occurred while uploading:", error);
      return null;
    }
  });

  // Returns public url; might be modified to download files to the server
  download = asyncHandler(async (fileId) => {
    try {
      return await this.client.getfilelink(fileId);
    } catch (error) {
      console.error("An unexpected error occurred when downloading:", error);
      return null;
    }
  });

  delete = asyncHandler(async (fileId) => {
    try {
      return await this.client.deletefile(fileId);
    } catch (error) {
      console.error("An unexpected error occurred while deleting:", error);
      return null;
    }
  });
}

module.exports = PCloudStorage;

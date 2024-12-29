// Basic abstract class 
class CloudStorageInterface {
  constructor(provider) {
    this.provider = provider; 
  }

  upload(file) {
    return this.provider.upload(file);
  }

  download(fileId) {
    return this.provider.download(fileId);
  }
}

module.exports = CloudStorageInterface;

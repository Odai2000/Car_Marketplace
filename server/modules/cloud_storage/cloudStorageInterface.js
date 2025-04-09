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

  delete(fileId) {
    return this.provider.delete(fileId);
  }
}

module.exports = CloudStorageInterface;

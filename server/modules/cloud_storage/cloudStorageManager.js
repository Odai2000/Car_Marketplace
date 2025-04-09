// Module to manage cloud provider(s)
const pCloudStorage = require('./pCloud');

class CloudStorageManager {
    constructor(provider) {
        if (provider === 'pcloud') {
            this.cloudProvider = new pCloudStorage();
        }
    }

    upload(file, folderId) {
        return this.cloudProvider.upload(file, folderId);
    }

    download(fileId) {
        return this.cloudProvider.download(fileId);
    }

    delete(fileId) {
        return this.cloudProvider.delete(fileId);
    }
}
module.exports = CloudStorageManager;

const mongoose = require("mongoose");

const makeSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  models: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Make", makeSchema);
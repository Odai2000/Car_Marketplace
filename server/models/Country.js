const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
});

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  code: {
    type: String,
    require: true,
    unique: true,
  },
  states: [stateSchema],
});

module.exports = mongoose.model("Country", countrySchema);

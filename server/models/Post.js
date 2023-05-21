const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 36,
  },
  desc: {
    type: String,
    maxLength: 240,
  },
  specs: {
    make: {
        type:String
    },
    model: {
        type:String
    },
    year:{
        type:Number
    },
    transmission: {
        type:String
    },
    mileage:{
        type:Number
    },
    condition: {
        type: String,
      },
    color:{
        type:String
    },
    engineType: {
      type: String,
    },
    hp: {
      type: Number,
    },
  },
  price: {
    type: Number,
  },
  location:{
    country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Post',postSchema)

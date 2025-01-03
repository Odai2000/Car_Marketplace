const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  make: {
    type: String,
  },
  model: {
    type: String,
  },
  year: {
    type: Number,
  },
  bodyType: {
    type: String,
  },
  transmission: {
    type: String,
  },
  mileage: {
    type: Number,
  },
  fuel: {
    type: String,
  },
  hp: {
    type: Number,
  },
  location: {
    country: String,
    state: String,
    city: String,
  },
  price: {
    type: Number,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 36,
    },
    desc: {
      type: String,
      maxLength: 240,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    imageIds: [String],
    car: {
      type: carSchema,
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);

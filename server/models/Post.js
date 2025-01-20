// TODO:
// Refactor location.
// Normalize make
// consider indexing
const mongoose = require("mongoose");

const Make = require("./Make");
const bodyTypesData = require('../data/bodyTypes.json')
const fuelTypesData = require('../data/fuelTypes.json')
const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    validate: {
      validator: async (make) => {
        return await Make.exists({ name: make });
      },
    },
  },
  model: {
    type: String,
    required: true,
    validate: {
      validator: async function (model) {
        const makeValue = this.make; //to avoid reference to query instead
        const make = await Make.findOne({ name: makeValue });
        return make && make.models.includes(model);
      },
    },
  },
  year: {
    type: Number,
    required: true,
  },
  bodyType: {
    type: String,
    required: true,
    enum: bodyTypesData.types
  },
  transmission: {
    type: String,
    required: true,
    enum: ["Automatic", "Manaul"],
  },
  mileage: {
    type: Number,
    required: true,
    min: 0,
  },
  fuel: {
    type: String,
    required: true,
    enum: fuelTypesData.types,
  },
  hp: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    country: String,
    state: String,
    city: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});
carSchema.pre("validate", async function (next) {
  if (this.make && this.model) {
    const make = await Make.findOne({ name: this.make });
  }
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
      required: true,
    },
    imageIds: [String],

    views: {
      type: Number,
      default: 0,
    },
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

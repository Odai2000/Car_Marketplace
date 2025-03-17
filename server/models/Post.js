// TODO:
// Normalize make
// consider indexing
const mongoose = require("mongoose");

// models
const Make = require("./Make");
const Country = require("./Country");

// json data
const bodyTypesData = require("../data/bodyTypes.json");
const fuelTypesData = require("../data/fuelTypes.json");

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
    enum: bodyTypesData.types,
  },
  transmission: {
    type: String,
    required: true,
    enum: ["automatic", "manual"],
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

  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const locationSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number },
  countryCode: {
    type: String,
    required: true,
    validate: {
      validator: async (countryCode) => {
        return await Country.exists({ code: countryCode }).lean();
      },
    },
  },
  stateCode: {
    type: String,
    required: true,
    validate: {
      validator: async (stateCode) => {
        const countryCode = this.countryCode;
        const country = await Country.findOne({ code: countryCode });

        return country.states.some((state) => state.code === stateCode);
      },
    },
  },
  address:{
    type:String
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
    location: {
      type: locationSchema,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);

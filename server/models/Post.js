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
  condition: {
    type: String,
    required: true,
    enum: ["New", "Excellent", "Good", "Fair", "Poor", "Salvage"],
  },
  transmission: {
    type: String,
    required: true,
    enum: ["Automatic", "Manual"],
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
  address: {
    type: String,
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
      maxLength: 400,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageIds: [String],

    views: {
      type: Number,
      default: 0,
    },
    uniqueViewers: {
      type: [String], // ids or ips
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Sold", "Archived"],
      default: "Active",
    },
    car: {
      type: carSchema,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
      score: {
      type: Number,
      min: 0,
      default:0,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

postSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "post_id",
  justOne: false,
});
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post_id",
  justOne: false,
});
postSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

postSchema.index({ user_id: 1 });
postSchema.index({ status: 1 });
postSchema.index({ "car.make": 1, "car.model": 1 });
postSchema.index({ price: 1 });

postSchema.methods.calculateScore = function () {
  const views = this.views || 0;
  const bids = this.bids?.length || 0;
  const comments = this.comments?.length || 0;
  const reputation = this.user?.reputation || 0;
  const createdAt = this.createdAt;

  const daysOld = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

  return 100 + (views * 1) +(bids*20) + (comments * 10) + (reputation * 5 - 20*(reputation>0)) - (daysOld * 0.1);
};

postSchema.pre('save', async function (next) {
  this.score = await this.calculateScore();
  next();
});


module.exports = mongoose.model("Post", postSchema);

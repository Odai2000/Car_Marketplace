const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
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
      type: Boolean
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
  location:{
    country:String,
    state:String,
    city:String
  },
  price: {
    type: Number,
  },
},) 

//is last edit necassry??
const postSchema = new mongoose.Schema({
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
  // image:[{
  //   type: bitmap
  // }],
  car: {
    type: carSchema,
    required:true
  }
},

{
  timestamps:true
});

module.exports = mongoose.model('Post',postSchema)

const mongoose = require( "mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    hasRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    actor:{
      user:{
       type: mongoose.Types.ObjectId,
       ref:"User",
       default:null
      },
      action:{
        type:String,
        enum:['comment','reply','bid','rate'],
        required:true
      }
    }
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Notification", notificationSchema);

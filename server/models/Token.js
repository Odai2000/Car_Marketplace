const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    token:{
        type:String,
        require:true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires:15*(24*60*60)  //15 days 15*(secs in day)
    }
})

module.exports = mongoose.model("Token",tokenSchema)
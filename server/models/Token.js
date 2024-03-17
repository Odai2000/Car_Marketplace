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
        expires:3600 //1 hour
    }
})

moduel.exports = mongoose.model("Token",tokenSchema)
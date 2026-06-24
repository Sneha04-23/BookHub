const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    condition:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        type:String,
        required:true
    },
    publishedYear:{
        type:Number
    },
    language:{
        type:String,
    },
    pages:{
        type:Number
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User'
    },
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status:{
        type: String,
        enum:["available", "reserved", "sold","exchanged"],
        default: "available"
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Book", bookSchema)
const mongoose = require("mongoose");
const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:'user'
    },
    image:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""

    },
    location:{
        type:String,
        default:""
    },
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Book"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("User", userSchema);

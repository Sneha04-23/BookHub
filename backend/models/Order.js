
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" ,
        required: true 
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
    price:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref: "B"

        type:Number,
        required:true

    },
    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "UPI"],
        default: "COD"
    },

    status: {
        type: String,
        enum:[
            "Pending",
            "Paid",
            "Processing", 
            "Shipped",
            "Out For Delivery",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }
},{timestamps:true} );

module.exports = mongoose.model("Order", orderSchema);

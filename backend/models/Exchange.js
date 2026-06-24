const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    offeredBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    requestedBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },

    extraAmount: {
        type: Number,
        default: 0
    },

    message: {
        type: String
    },
    requesterStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Received"],
        default: "Pending"
    },

    ownerStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Received"],
        default: "Pending"
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Rejected",
            "Completed"
        ],
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "Exchange",
    exchangeSchema
);
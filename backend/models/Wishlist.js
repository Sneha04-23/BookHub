

const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
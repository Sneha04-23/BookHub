const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadUserImg")
const {signupUser , loginUser, getUsers, getProfile,
    updateProfile, addToWishlist,removeWishlist, 
    getWishlist , getSellerProfile
} = require ("../controllers/userController");


// ------------------------------------------------------------------------------// 

router.post("/signup",signupUser);
router.post("/login",loginUser);

router.get("/" ,authMiddleware, getUsers)

//----PROFILE----------------------------------------

router.get("/profile", authMiddleware, getProfile)

router.put("/profile", authMiddleware,upload.single("image"),updateProfile);

//------ADMIN-------------------------------------------

router.get("/admin/users", authMiddleware, adminMiddleware, getUsers)

// ----WISHLIST-----

router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist/:bookId", authMiddleware, addToWishlist);
router.delete("/wishlist/:bookId", authMiddleware, removeWishlist);

//----SELLER PROFILE--------------------------------------

router.get("/:id", getSellerProfile)


module.exports = router;

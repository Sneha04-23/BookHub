const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params:async(req, file) => ({
        folder: "bookhub/users",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: Date.now() + "-" + file.originalname
    })
});

const upload = multer ({storage});

module.exports = upload;
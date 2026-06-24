const express = require("express");
const router =  express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addBook, getBooks, getMyBook,getBookById,getAllBooksAdminOrUser, deleteBook  } = require("../controllers/bookController");
const upload = require("../middleware/uploads")


//------------------------------------------------//

router.post("/add",authMiddleware, upload.single("image"), addBook);
router.get("/" , getBooks)

router.get("/my-books", authMiddleware, getMyBook)

router.get("/books.all",getAllBooksAdminOrUser)

router.get("/:id", getBookById)

router.delete("/:id", authMiddleware, deleteBook)


module.exports = router;
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getDashboard, getAllUsers, deleteUser, getAllBooks, deleteBook,
    getSoldBooks,getAllExchanges,getAllOrders
 } = require("../controllers/adminController")

// router.get("/dashboard", authMiddleware, adminMiddleware,
//     (req,res) => {
//         res.json({message: "Welcome Admin"})
//     }
// );

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboard)
router.get("/users",authMiddleware,adminMiddleware,getAllUsers)
router.get("/books", authMiddleware,adminMiddleware,getAllBooks);
router.get("/sold-books", authMiddleware,adminMiddleware, getSoldBooks);
router.get("/exchanges", authMiddleware,adminMiddleware,getAllExchanges);
router.get("/orders", authMiddleware,adminMiddleware,getAllOrders);

router.delete("/books/:id", authMiddleware,adminMiddleware,deleteBook);
router.delete("/users/:id",authMiddleware,adminMiddleware,deleteUser)


module.exports = router;

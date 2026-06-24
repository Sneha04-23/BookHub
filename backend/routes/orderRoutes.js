const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { createOrder, getMyOrders, getSellerOrders, updateOrderStatus, getNotifications,cancelOrder, markNotificationsRead} = require("../controllers/orderController")

// -------------------------------------------------------------

router.post("/buy/:id", authMiddleware,createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/seller-orders", authMiddleware, getSellerOrders);

router.get("/notifications", authMiddleware, getNotifications);
router.put("/notification/read", authMiddleware, markNotificationsRead)

router.put("/update-status/:id", authMiddleware, updateOrderStatus);

router.put("/cancel/:id", authMiddleware,cancelOrder)


module.exports = router 
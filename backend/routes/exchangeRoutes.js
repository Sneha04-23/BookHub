const express = require("express");

const router = express.Router();

const { createExchange, getMyExchanges, acceptExchange,
    rejectExchange , completeExchange,updateExchangeStatus } = require("../controllers/exchangeBookController");

const protect = require("../middleware/authMiddleware");
const authMiddleware = require("../middleware/authMiddleware");



router.post( "/create",  protect, createExchange );

router.get( "/my-exchanges",protect, getMyExchanges );

router.put( "/accept/:id", protect, acceptExchange );

router.put(  "/reject/:id", protect, rejectExchange );

// router.put("/completr/:id", protect, completeExchange);
router.put("/update-status/:id", authMiddleware,updateExchangeStatus)

module.exports = router;
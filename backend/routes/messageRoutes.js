const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")
const { getConversations } = require("../controllers/messageController")
const Message = require("../models/Message");

router.get("/", authMiddleware, async(req,res) =>{
    try{
        const messages = await Message.find({
            receiver:req.user.id,
            isRead: false 
        });

        res.json(messages);

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get("/conversations/:userId", getConversations )

router.get("/:sender/:receiver",
    async(req, res) => {
        const messages = await Message.find({

            $or: [
                {
                    sender: req.params.sender,
                    receiver:req.params.receiver 
                },
                {
                    sender: req.params.receiver,
                    receiver: req.params.sender 
                }
            ]
        }).sort({ createdAt: 1});

        res.json(messages);
    }
);

router.put("/read/:sender/:receiver", async(req, res) => {

    try {

        await Message.updateMany(

            {
                sender: req.params.sender,
                receiver: req.params.receiver,
                isRead: false
            },

            {
                $set: { isRead: true }
            }

        );

        res.json({ success: true });

    } catch(err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;

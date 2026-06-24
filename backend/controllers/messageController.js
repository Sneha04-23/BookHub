const Message = require("../models/Message");
const User = require("../models/User");

const getConversations = async(req , res) => {
    try{

        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                {sender: userId},
                { receiver: userId }
            ]
        })
        .sort({ createdAt: -1 });

        const userMap = new Map();

        for (let msg of messages) {

            const otherUser = 
                String(msg.sender) == String(userId)
                ? msg.receiver
                : msg.sender;

            if(!userMap.has(String(otherUser))) {

                const user = await User.findById(otherUser);

                const unreadCount = await Message.countDocuments({

                    sender: otherUser,
                    receiver: userId,
                    isRead: false
                })

                userMap.set(String(otherUser), {

                    sellerId: otherUser,
                    name: user.name,
                    image: user.image,

                    lastMessage: msg.text ,
                    unreadCount: unreadCount,
                    time: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                });
                
            }
        }

        res.json([...userMap.values()]);

    } catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = { getConversations }
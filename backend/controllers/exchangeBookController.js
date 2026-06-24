
const Exchange = require("../models/Exchange");
const Book = require("../models/Book");
const Notification = require("../models/Notification");
const Message = require("../models/Message");

// =========CREATE EXCHANGE REQUEST======================================

const createExchange = async (req, res) => {
    try {

        const {
            requestedBook,
            offeredBook,
            extraAmount,
            message
        } = req.body;

        const requestedBookData =
            await Book.findById(requestedBook);

        const offeredBookData =
            await Book.findById(offeredBook);

        if (!requestedBookData) {
            return res.status(404).json({
                message: "Requested book not found"
            });
        }

        if (!offeredBookData) {
            return res.status(404).json({
                message: "Offered book not found"
            });
        }

        // Cannot exchange own book
        if (
            requestedBookData.seller.toString() ===
            req.user.id
        ) {
            return res.status(400).json({
                message: "You cannot exchange your own book"
            });
        }

        // Must own offered book
        if (
            offeredBookData.seller.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "You can only offer your own book"
            });
        }

        // Book availability check
        if (
            requestedBookData.status !== "available" ||
            offeredBookData.status !== "available"
        ) {
            return res.status(400).json({
                message: "One of the books is unavailable"
            });
        }

        // Duplicate request check
        const existingExchange =
            await Exchange.findOne({
                requester: req.user.id,
                requestedBook,
                offeredBook,
                status: "Pending"
            });

        if (existingExchange) {
            return res.status(400).json({
                message: "Exchange request already sent"
            });
        }

        const exchange =
            await Exchange.create({
                requester: req.user.id,
                owner: requestedBookData.seller,
                requestedBook,
                offeredBook,
                extraAmount,
                message
            });

        await Notification.create({
            user: requestedBookData.seller,
            message: `${req.user.name} requested an exchange for "${requestedBookData.title}"`,
            type: "exchange"
        });

        await Message.create({
            sender: req.user.id,
            receiver: requestedBookData.seller,
            text: `Exchange request sent for "${requestedBookData.title}".`
        });

        res.status(201).json(exchange);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ========GET MY EXCHANGES============================================

const getMyExchanges = async (req, res) => {
    try {

        const exchanges =
            await Exchange.find({
                $or: [
                    { requester: req.user.id },
                    { owner: req.user.id }
                ]
            })
            .populate("requestedBook")
            .populate("offeredBook")
            .populate("requester", "name image")
            .populate("owner", "name image")
            .sort({ createdAt: -1 });

        res.json(exchanges);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};
//======ACCEPT EXCHANGE ====================================== 

const acceptExchange = async (req, res) => {
    try {

        const exchange =
            await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({
                message: "Exchange not found"
            });
        }

        // Only owner can accept
        if (
            exchange.owner.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (exchange.status !== "Pending") {
            return res.status(400).json({
                message: "Exchange already processed"
            });
        }

        const offeredBook =
            await Book.findById(exchange.offeredBook);

        const requestedBook =
            await Book.findById(exchange.requestedBook);

        if (!offeredBook || !requestedBook) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        if (
            offeredBook.status !== "available" ||
            requestedBook.status !== "available"
        ) {
            return res.status(400).json({
                message: "One of the books is unavailable"
            });
        }

        // Transfer ownership
        offeredBook.status = "reserved";
        requestedBook.status = "reserved";

        await offeredBook.save();
        await requestedBook.save();

        exchange.status = "Accepted";
        exchange.requesterStatus = "Pending";
        exchange.ownerStatus = "Pending";
        
        await exchange.save();

        // Reject all related pending exchanges
        const otherExchanges =
            await Exchange.find({
                _id: { $ne: exchange._id },
                status: "Pending",
                $or: [
                    { requestedBook: exchange.requestedBook },
                    { offeredBook: exchange.requestedBook },
                    { requestedBook: exchange.offeredBook },
                    { offeredBook: exchange.offeredBook }
                ]
            });

        await Exchange.updateMany(
            {
                _id: { $ne: exchange._id },
                status: "Pending",
                $or: [
                    { requestedBook: exchange.requestedBook },
                    { offeredBook: exchange.requestedBook },
                    { requestedBook: exchange.offeredBook },
                    { offeredBook: exchange.offeredBook }
                ]
            },
            {
                status: "Rejected"
            }
        );

        // Accepted notification
        await Notification.create({
            user: exchange.requester,
            message: "Your exchange request was accepted ✅",
            type: "exchange"
        });

        await Message.create({
            sender: exchange.owner,
            receiver: exchange.requester,
            text: "Your exchange request has been accepted. You can now discuss exchange details."
        });

        // Notify rejected users
        for (const ex of otherExchanges) {

            await Notification.create({
                user: ex.requester,
                message: "Your exchange request was automatically rejected because this book has already been exchanged.",
                type: "exchange"
            });

        }

        res.json({
            message: "Exchange accepted successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// ======== REJECT EXCHANGE ====================================

const rejectExchange = async (req, res) => {
    try {

        const exchange =
            await Exchange.findById(req.params.id);

        if (!exchange) {
            return res.status(404).json({
                message: "Exchange not found"
            });
        }

        if (
            exchange.owner.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        if (exchange.status !== "Pending") {
            return res.status(400).json({
                message: "Exchange already processed"
            });
        }

        exchange.status = "Rejected";

        await exchange.save();

        await Notification.create({
            user: exchange.requester,
            message: "Your exchange request was rejected ❌",
            type: "exchange"
        });

        await Message.create({
            sender: exchange.owner,
            receiver: exchange.requester,
            text: "Sorry, your exchange request has been rejected."
        });

        res.json({
            message: "Exchange rejected"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
};


// const completeExchange = async (req, res) => {
//     try {

//         const exchange = await Exchange.findById(req.params.id);

//         if (!exchange) {
//             return res.status(404).json({
//                 message: "Exchange not found"
//             });
//         }

//         if (exchange.status !== "Accepted") {
//             return res.status(400).json({
//                 message: "Exchange must be accepted first"
//             });
//         }

//         const offeredBook =
//             await Book.findById(exchange.offeredBook);

//         const requestedBook =
//             await Book.findById(exchange.requestedBook);

//         if (!offeredBook || !requestedBook) {
//             return res.status(404).json({
//                 message: "Book not found"
//             });
//         }

//         // Transfer ownership
//         offeredBook.seller = exchange.owner;
//         requestedBook.seller = exchange.requester;

//         offeredBook.buyer = null;
//         requestedBook.buyer = null;

//         offeredBook.status = "exchanged";
//         requestedBook.status = "exchanged";

//         await offeredBook.save();
//         await requestedBook.save();

//         exchange.status = "Completed";

//         await exchange.save();

//         await Notification.create({
//             user: exchange.requester,
//             message: "Exchange completed successfully ✅",
//             type: "exchange"
//         });

//         await Notification.create({
//             user: exchange.owner,
//             message: "Exchange completed successfully ✅",
//             type: "exchange"
//         });

//         res.json({
//             message: "Exchange completed successfully"
//         });

//     } catch (err) {

//         console.log(err);

//         res.status(500).json({
//             message: "Server Error"
//         });

//     }
// };


const updateExchangeStatus = async(req,res) => {
    try{
        const exchange = await Exchange.findById(
            req.params.id 
        );

        if(!exchange) {
            return res.status(404).json({message: "Exchange not found"})
        }

        const {status} = req.body;
    
        if( status !== "Shipped" && status !== "Received" ) 
        {
        return res.status(400).json({message:"Invalid status"}) 
        }

        if(exchange.requester.toString() === req.user.id){
            exchange.requesterStatus = status;

            await Notification.create({
                user: exchange.owner,
                message: `Requester update exchange status to ${status}`
            })
        }
        else if(exchange.owner.toString() === req.user.id){
            exchange.ownerStatus = status;

            await Notification.create({
                user: exchange.requester,
                message: `Owner updated exchange status to ${status}`
            });
        }
        else{
            return res.status(403).json({message: "Not authorized"})
        }
        if( exchange.requesterStatus === "Received" && exchange.ownerStatus === "Received") {

            const offeredBook = await Book.findById(exchange.offeredBook);
            const requestedBook = await Book.findById(exchange.requestedBook);

            offeredBook.seller = exchange.owner;
            requestedBook.seller = exchange.requester;

            offeredBook.status = "exchanged";
            requestedBook.status = "exchanged";

            offeredBook.buyer = null;
            requestedBook.buyer = null;

            await offeredBook.save();
            await requestedBook.save();

            exchange.status = "Completed";
        }

        await exchange.save();
        res.json(exchange)

        console.log(exchange.requesterStatus);
        console.log(exchange.ownerStatus);
        console.log(req.user.id);
    } catch(err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        })
    }

}

module.exports = {
    createExchange,
    getMyExchanges,
    acceptExchange,
    rejectExchange, 
    // completeExchange,
    updateExchangeStatus
};


const Order = require("../models/Order");
const Book = require("../models/Book");
const Notification = require("../models/Notification")

const createOrder = async (req, res) => {

 try {
        const {
            address,
            city,
            pincode,
            phone,
            paymentMethod
        } = req.body;

        // 🔒 ATOMIC BOOK RESERVATION (prevents double booking)
        const book = await Book.findOneAndUpdate(
            {
                _id: req.params.id,
                status: "available"
            },
            {
                $set: {
                    status: "reserved",
                    buyer: req.user.id
                }
            },
            { new: true }
        );

        // if book not found or already reserved/sold
        if (!book) {
            return res.status(400).json({
                message: "Book already reserved or sold"
            });
        }

        // 🚫 prevent self purchase
        if (book.seller.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot buy your own book"
            });
        }

        // 🚫 prevent duplicate order
        const existingOrder = await Order.findOne({
            buyer: req.user.id,
            book: req.params.id,
            status: { $ne: "Cancelled" }
        });

        if (existingOrder) {
            return res.status(400).json({
                message: "Order already exists for this book"
            });
        }

        // 🧾 create order
        const order = await Order.create({
            buyer: req.user.id,
            seller: book.seller,
            book: book._id,
            price: book.price,
            address,
            city,
            pincode,
            phone,
            paymentMethod,
            status: paymentMethod === "UPI" ? "Paid" : "Pending"
        });

        // 🔔 notifications
        await Notification.create({
            user: book.seller,
            message: `${req.user.name} purchased ${book.title}`
        });

        await Notification.create({
            user: req.user.id,
            message:
                paymentMethod === "UPI"
                    ? "Payment successful"
                    : "Order placed successfully (COD pending)"
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message || "Server Error"
        });
    }

};

const getMyOrders = async(req,res) => {

    const orders = await Order.find({
        buyer: req.user.id
    })
    .sort({ createdAt: -1})
    .populate("book")
    .populate("seller", "name");

    res.json(orders);
};

const getSellerOrders = async(req,res) => {
    try{

        const orders = await Order.find({
            seller: req.user.id 
        })
        .sort({ createdAt: -1})
        .populate("book")
        .populate("buyer","name")

        res.json(orders)

        
    } catch(err) {
        res.status(500).json({message:"Server Error"})
    }
};

const updateOrderStatus = async(req,res) => {

    const order = await Order.findById(req.params.id);

    if(!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    if(
        order.status === "Delivered" || order.status === "Cancelled"
    ){
        return res.status(400).json({
            message: "order status cannot be changed"
        })
    }

    if(order.seller.toString() !== req.user.id) {
        return res.status(403).json({
            message:"Not authorized"
        });
    }

    order.status = req.body.status;

    await order.save();

    if(order.status === "Delivered") {
        const book = await Book.findById(order.book);
            
        if(book){
            book.status = "sold";
            book.buyer = order.buyer;
            await book.save();
        }
    }

    if(order.status === "Cancelled"){
        const book = await Book.findById(order.book);

        if(book){
            book.status = "available";
            book.buyer = null;

            await book.save()
        }
    }

    
    await Notification.create({
        user: order.buyer,
        message: `Your order status changed to ${order.status}`
    })
    
    res.json(order)

}

const cancelOrder = async(req,res) => {
    try{
        const order = await Order.findById(req.params.id);

        if(!order) {
            return res.status(404).json({message: "Order not found"})
        }
        if(order.status !== "Pending") {
            return res.status(400).json({message: "Order already shipped"})
        }

        if( order.status === "Shipped" || order.status === "Delivered" ) {
            return res.status(400).json({
                message:"Order cannot be cancelled"
            })
        }
        order.status = "Cancelled";
        await order.save();

        const book = await Book.findById(order.book);

        if(book) {
            book.status = "available";
            book.buyer = null 

            await book.save()
        }

        res.json({
            message: "Order cancelled successfully"
        })
    } catch(err) {
        res.status(500).json({
            messsage: err.message
        });
    }

    
};

const getNotifications = async(req,res) => {
    try{
        const notifications = await Notification.find({
            user:req.user.id 
        }).sort({createdAt:-1})

        const unreadCount = await Notification.countDocuments({
            user: req.user.id,
            isRead: false
        })

        res.json({notifications, unreadCount} )        
    } catch (err){
        res.status(500).json({message: "Server Error"})
    }

}

const markNotificationsRead = async (req,res) => {
    await Notification.updateMany(
        {
            user: req.user.id,
            isRead:false 
        },
        {
            isRead: true 
        }
    );

    res.json({message:"Notificatio Marked as read"})
}

module.exports = { createOrder, getMyOrders,
     getSellerOrders, updateOrderStatus, getNotifications,cancelOrder, markNotificationsRead };
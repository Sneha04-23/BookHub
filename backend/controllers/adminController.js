const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");
const Exchange = require("../models/Exchange")

const getDashboard = async(req,res) => {
    try{
        const totalUser = await User.countDocuments();
        const totalBooks = await Book.countDocuments();
        const  totalOrders = await Order.countDocuments();

        const soldBooks = await Book.countDocuments({
            status:"sold"
        });
        const totalExchanges = await Exchange.countDocuments();
        
        const completedExchanges = await Exchange.countDocuments({
            status:"Completed"
        })
        const reservedBooks = await Book.countDocuments({
            status:"reserved"
        })

        const recentUsers = await User.find()
                    .select("name email createdAt image")
                    .sort({ createdAt: -1})
                    .limit(5)
        
        res.json({
            totalUser,
            totalBooks,
            totalOrders,
            recentUsers,
            soldBooks,
            
            reservedBooks,
            totalExchanges,
            completedExchanges

        });

    } catch (err) {
        console.log(err);

        res.status(500).json({message: "server Error"})
    }
}
//---USER---------------------------------------
const getAllUsers = async(req,res) => {
    const users = await User.find().select("-password")
    .sort({ createdAt: -1 });

    res.json(users);
};

const deleteUser = async(req,res) => {

    await User.findByIdAndDelete(req.params.id);

    await Book.deleteMany({
        seller: req.params.id 
    });

    res.json({message: "User deleted"})
};

//---BOOKS----------------------------------------------------

const getAllBooks = async(req,res) => {
    const books = await Book.find()
            .populate("seller", "name email image")
            .sort({ createdAt: -1 });
    
    res.json(books);
};

const deleteBook = async (req,res) => {
    await Book.findByIdAndDelete(req.params.id);

    res.json({message: "Book removed"});
};


const getSoldBooks = async( req,res) => {
    const books = await Book.find({
        status:"sold"
    }).populate("seller", "name email image")
    .sort({ createdAt: -1 });

    res.json(books);
};

const getAllExchanges = async(req,res) => {
    const exchanges = await Exchange.find()
                    .populate("requester","name email image")
                    .populate("owner", "name email image")
                    .populate("requestedBook","title")
                    .populate("offeredBook", "title")
                    .sort({createdAt:-1})

    res.json(exchanges)
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("buyer", "name email image")
            .populate({
                path:"book", 
                populate: {
                    path:"seller",
                    select:"name email image"
                }
            })
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getDashboard, getAllUsers, deleteUser, getAllBooks, deleteBook,
                    getSoldBooks,getAllExchanges, getAllOrders};
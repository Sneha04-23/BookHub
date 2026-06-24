const User = require("../models/User");
const Book = require("../models/Book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// -------------SignUp--------------------------//


const signupUser = async (req,res) => {
    try{
        const { name, email, password } = req.body;

        if(!name || !email || !password ){
            return res.status(400).json({message: "All fields are require"})
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email:user.email,
                role:user.role,
                image:user.image,
                bio: user.bio,
                location: user.location
                
            },
            process.env.JWT_SECRET,
            { expiresIn:"1d"}
        );

        // await user.save();

        res.status(201).json({
            message: "User create successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image:user.image,
                bio: user.bio,
                location: user.location
            }
        });


    }catch (err) {
        res.status(500).json({error: err.message})
    }
}

// ------------------LOGIN---------------------------------------------------------

const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid email" })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) {
            return res.status(400).json({message: "Invalid password" })
        }


        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image:user.image,
                bio: user.bio,
                location: user.location
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        );
        res.json({
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image:user.image,
                bio: user.bio,
                location: user.location
            }
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
}



// --------------Get User-----------------------------------------------

const getUsers = async (req,res) => {
    try{
        const users = await User.find().select( "name email role ");
        res.json(users);
    }catch(err) {
        res.status(500).json({ error: err.message })
    }
}

// ----------Profile--------------------------------------------------------------------//

const getProfile = async(req,res) => {
    try{

        const user = await User.findById(
            req.user.id 
        ).select("-password");

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch(err){
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
}

// -------Update Profile------------------------------------------------------

const updateProfile = async(req, res) => {
    try{
        const user = await User.findById(req.user.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.location = req.body.location || user.location;

        if(req.file) {
            user.image = req.file.path;

        }

        await user.save();
        
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            bio: user.bio,
            location: user.location
        });
    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: "Server Error"
        });
    }
}

//------ADD TO WISHLIST----------------------------------------------

const addToWishlist = async (req,res) => {

    try{

        const user = await User.findById(req.user.id);

        const bookId = req.params.bookId;

        // if(user.wishlist.includes(bookId)) {
        //     return res. status(400).json({
        //         message: "Book already in wishlist"
        //     });
        // }

        const alreadyExists = user.wishlist.some(
            (id) => id.toString() === bookId 
        );

        if(alreadyExists) {
            return res.status(400).json({
                message: "Book already in wishlist"
            })
        }

        user.wishlist.push(bookId);

        await user.save();

        res.json({
            message: "Book added to wishlist",
            wishlist: user.wishlist 
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({message : "Server Error"})
    }
}

//------REMOVE WISHLIST------------------------------------------------------------------------

const removeWishlist = async (req,res) => {
    try{

        const user = await User.findById(req.user.id);
        const bookId = req.params.bookId;

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== bookId
        );

        await user.save();

        res.json({message : "Removed from wishlist", wishlist: user.wishlist})
    } catch(err){
        console.log(err);

        res.status(500).json({
            message: "Server Error"
        })
    }
};


//------GET WISHLIST-------------------------------------------------

const getWishlist = async (req, res) => {
    try{

        const user = await User.findById(req.user.id)
            .populate("wishlist");

        res.json(user.wishlist);
    }catch(err){
        console.log(err);

        res.status(500).json({
            message:"server error"
        })
    }
}

//-------GET SELLER---------------------------------------------

const getSellerProfile = async(req,res) => {

    try {

        const user =
            await User.findById(req.params.id)
            .select("-password");

        const books =
            await Book.find({
                seller: req.params.id
            });

        res.json({
            user,
            books
        });

    } catch(err){

        res.status(500).json({
            message: err.message
        });

    }

};


module.exports = {signupUser,loginUser, getUsers, getProfile, 
    updateProfile, addToWishlist, removeWishlist, 
    getWishlist, getSellerProfile };
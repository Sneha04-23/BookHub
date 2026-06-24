const Book = require("../models/Book");

// -------------Add Book-------------------------------------------------------------------------------------

const addBook = async (req, res) => {
    try{

        let image ="";
        if(req.file){
            image = req.file.path;
        }

        const {
            title,
            author,
            price,
            mrp,
            condition,
            category,
            description,
            language,
            pages,
            publishedYear
            
        } = req.body;


        if( !title ||
            !author ||
            !price ||
            !mrp ||
            !condition ||
            !category ||
            !description ||
            !image
        ) {
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const book = await Book.create({
            title,
            author,
            price,
            mrp,
            condition,
            category,
            description,
            language,
            pages,
            publishedYear,
            image,
            
            //seller comes from logged-in user
            seller: req.user.id
        });
        console.log("FILE:", req.file);
        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch(err) {
        res.status(500).json({
            error: err.message
        });
    };
};

// ------------GET MY BOOK-------------------------------------

const getMyBook = async(req,res) => {
    try{

        const books = await Book.find({
            seller:req.user.id  
        })
        .sort({ createdAt: -1 });

        res.json(books);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

// ------------Get book-----------------------------------------------------------------

const getBooks = async (req, res) => {
    try{
        const books = await Book.find({status:"available"}).populate(
            "seller",
            "name "
        )
        .sort({ createdAt: -1 });
        res.json(books);
    } catch(err) {
        res.status(500).json({
            error: err.message
        })
    }
}

// -----GET BOOK BY ID-------------------------------------------------------

const getBookById = async(req,res) => {
    try{

        const book = await Book.findById(req.params.id)
        .populate("seller","name image")
        .sort({ createdAt: -1 });

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        res.json(book);

    } catch(err){
        res.status(500).json({
            error: err.message
        });
    }
}

const getAllBooksAdminOrUser = async (req,res) => {
    try{
        const books = await Book.find()
            .populate("seller", "name email image")
            .sort({ createdAt: -1 });
        res.json(books);
        
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}


// ---------DELETE BOOK-------------------------------------------------------------

const deleteBook = async(req,res)=> {
    try{
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({message: "Book not found"});
        }

        if(book.seller.toString() !== req.user.id) {
            return res.status(401).json({message: "Not authorized"});
        }

        await book.deleteOne()

        res.json({
            message: "Book Deleted"
        })
    }catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = { addBook,getBooks,  getMyBook,getBookById, deleteBook, getAllBooksAdminOrUser }
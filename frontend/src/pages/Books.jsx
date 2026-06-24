

import "./Books.css";
import { useEffect, useState } from "react";
// import API from "../services/api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../redux/bookSlice";

const allCategory =["Fiction","Non-Fiction","Romance","Fantasy","Science Fiction","Technology" ,
     "Mystery & Thriller","Historical Fiction","Biography","Self Help","Business",
     "Finance","Education" ,"Academic", "Children","Comics",
     "Poetry","Philosophy","Religion","Medical","Engineering","Entrance Exam"]
                        

function Books(){

    // const [books, setBooks] = useState([]);


    const dispatch = useDispatch();

    const { books, loading, error } =useSelector(
        (state) => state.books 
    );

    const location = useLocation();

    const navigate = useNavigate();


    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedCondition, setSelectedCondition] = useState("")
    const [selectedPrice, setSelectedPrice] = useState("");

    const [showAllCategories, setShowAllCategories] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search") || "" ;
    

    useEffect(() => {

        // fetchBooks();
        if(books.length === 0){
            dispatch(fetchBooks());
        }
        

    }, [dispatch, books.length]);

    // const fetchBooks = async () => {

    //     try{

    //         const token = localStorage.getItem("token");

    //         const res = await API.get("/books");

    //         setBooks(res.data);

    //     } catch(err){

    //         console.log(err);

    //     }

    // };

    // const categories = [...new Set(
    //     books.map((book) => book.category)  
    // )];

    const visibleCategories = showAllCategories
    ? allCategory
    : allCategory.slice(0, 6);

    // SEARCH FILTER

    const filteredBooks = books.filter((book) => {
        const matchesSearch = 
            book.title.toLowerCase().includes(
                searchQuery.toLowerCase()
            ) || 
            book.author.toLowerCase().includes(
                searchQuery.toLocaleLowerCase()
            );
        
        const matchesCategory = 
            selectedCategory === "" ||
            book.category === selectedCategory;
        
        const matchesCondition = 
            selectedCondition === "" ||
            book.condition === selectedCondition;

        let matchesPrice = true;

            if(selectedPrice === "0-200"){
                matchesPrice = book.price <= 200;
            }

            else if(selectedPrice === "200-500"){
                matchesPrice =
                    book.price > 200 &&
                    book.price <= 500;
            }

            else if(selectedPrice === "500-1000"){
                matchesPrice =
                    book.price > 500 &&
                    book.price <= 1000;
            }

            else if(selectedPrice === "1000+"){
                matchesPrice = book.price > 1000;
            }
        
        return (
            matchesSearch &&
            matchesCategory&&
            matchesCondition&&
            matchesPrice
        );
            
            
    })
    
    if(loading){
        return <h2>Loading books...</h2>
    }

    if(error){
        return <h2>{error}</h2>
    }


    return(

        <div className="books-page">
            

            {/* SIDEBAR */}

            <div className="sidebar">

                <h2>
                    Filters
                </h2>

                <div className="filter-group">

                    <h3>Categories</h3>

                    {
                        // ["Fiction" ,"Non-Fiction", "Science",  "Technology" , "Programming", "History", "Biography", "Self Help" ,"Business" ,"Finance", "Education" , "Academic", "Comics", "Children",  "Novel","Poetry", "Philosophy","Religion", "Medical","Engineering" ,"Entrance Exam"]
                        visibleCategories.map((category) => (
                            
                            <p 
                                key={category}
                                className={
                                    selectedCategory === category
                                    ? "active-filter"
                                    :""
                                }

                                onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                            >
                                {category}
                            </p>
                        ))
                    }

                    <button
                        className="view-more-btn"

                        onClick={() =>
                            setShowAllCategories(!showAllCategories)
                        }
                        >
                        {
                            showAllCategories
                            ? "View Less"
                            : "View More"
                        }
                    </button>

                </div>

                <div className="filter-group">

                    <h3>Condition</h3>

                    {
                        ["New", "Like New", "Good", "Acceptable" ]
                        .map((condition) => (
                            <p
                                key = {condition}

                                className={
                                    selectedCondition === condition
                                    ? "active-filter"
                                    : ""
                                }

                                onClick={() => setSelectedCondition(selectedCondition === condition ? "" : condition)}
                            >
                                {condition}
                            </p>
                        ))
                    }

                </div>

                <div className="filter-group">

                    <h3>Price Range</h3>

                    {
                        [
                            "0-200",
                            "200-500",
                            "500-1000",
                            "1000+"
                        ].map((price) => (
                            <p 
                                key={price}
                                className={
                                    selectedPrice === price
                                    ? "active-filter"
                                    :""
                                }

                                onClick={() => setSelectedPrice(selectedPrice === price ? "" : price)}
                            >
                                ₹ {price}
                            </p>
                        ))
                    }

                </div>

                <button 
                    className="clear-filter-btn"

                    onClick={() => {
                        setSelectedCategory("");
                        setSelectedCondition("");
                        setSelectedPrice("");
                        
                    }}
                >
                    Clear Filters
                </button>

            </div>

            {/* RIGHT CONTENT */}
            
            <div className="books-content">

                {/* TOP */}

                <div className="books-top">

                   <p className="backbtn1" onClick={()=>navigate("/")}> ◀ </p>

                    <h1>
                        All Books
                    </h1>

                </div>

                {/* GRID */}

                <div className="books-grid">

                    {
                        filteredBooks.map((book) => (

                            <div
                                className="book-card"
                                key={book._id}

                                onClick={() => navigate(`/book-details/${book._id}`)}
                            >

                                <img
                                    src={book.image}
                                />

                                <h3>
                                    {book.title}
                                </h3>

                                <p>
                                    {book.author}
                                </p>

                                <div className="book-bottom">

                                    <span>
                                        ₹{book.price}
                                    </span>

                                    <small>
                                        {book.condition}
                                    </small>

                                </div>

                                <div className={`status-badge ${book.status}`} >
                                    { book.status === "sold"
                                        ? "SOLD OUT"
                                        :book.status === "reserved"
                                        ? "RESERVED"
                                        :"AVAILABLE"
                                    }
                                </div>

                                

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );
}

export default Books;


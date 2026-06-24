
import { useEffect, useState } from "react";
// import API from "../services/api";
// import bookImage from "../assets/book1.png"
import { useNavigate } from "react-router-dom";

// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../redux/bookSlice";

import "./Home.css"


function Home(){

    // const [books, setBooks] = useState([]);

    const [showAllCategories, setShowAllCategories] = useState(false);

    const navigate = useNavigate();
    // const token = localStorage.getItem("token");
    const { token } = useSelector(
        (state) => state.auth 
    )
    const isLoggedIn = !!token

    

    const bookImage = "https://res.cloudinary.com/dizdyqvus/image/upload/v1781197586/book1_ow9mwm.png"

    

    const dispatch = useDispatch();

    const {books, loading, error } = useSelector(
        (state) => state.books 
    );
    const sampleBooks = books.slice(0, 8);

    useEffect(() => {
        // fetchBooks();
        if(books.length === 0) {
            dispatch(fetchBooks());
        }
        
    }, [dispatch, books.length]);

    // const fetchBooks = async () => {
    //     try{

           

    //         const res = await API.get("/books")

    //         console.log(res.data);

    //         setBooks(res.data);
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }


    const handleBrowseBooks = () => {
        if(!isLoggedIn){
            navigate("/login")
            return;
        }
        navigate("/books")
    }

    const handleSellBook =() => {
        if(!isLoggedIn){
            navigate("/login")
            return;
        }
        navigate("/add-book")
    }
    
    const categoryCount = {};

    

    books.forEach((book) => {

        if(categoryCount[book.category]){

            categoryCount[book.category]++;
        } else{
            categoryCount[book.category] = 1;
        }
    });
    const categoryEntries = Object.entries(categoryCount);


    const visibleCategories = categoryEntries.slice(0,4);

    return (
        <div className="home-page">
            {/* <h1>Home Page</h1> */}

            <section  className="hero">

                <div className="hero-left">
                    <h1>Buy, Sell & Exchange Used Books</h1>
                    
                    <p>
                        Give your books a new home and 
                        discover your next favorite read at the best price.
                    </p>

                    <div className="hero-buttons">
                        <button className="browse-btn"  onClick={handleBrowseBooks}>
                            Browse Books 
                        </button>

                        <button className="sell-btn"  onClick={handleSellBook}>
                            Sell a Book
                        </button>

                    </div>

                </div>

                <div className="hero-right">

                    <img src={bookImage}alt="books" />
                </div>

            </section>

            <section className="book-page">
                <div className="books-books">
                <h2>Books</h2>
                    {
                        books.length > 8 && (
                            <div className="view-more">
                                <button 
                                    className="view-more-btn1" 
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            navigate("/login");
                                            return;
                                        }

                                        navigate("/books")
                                    }}
                                >
                                    {/* View More */}
                                        ⟩
                                </button>

                            </div>
                        )
                    }
                </div>
                <div className="books-grid">

                    {
                        sampleBooks.map((book) => (

                            

                            <div
                                className="book-card"
                                key={book._id}

                                onClick={() => {
                                    if (!isLoggedIn) {
                                        navigate("/login");
                                        return;
                                    }

                                    navigate(`/book-details/${book._id}`);
                                }}
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
            </section>


            <section className="category-section">

                <h2>Popular Categories</h2>
                
                {
                    categoryEntries.length > 4 && (
                        <div className="view-more">
                            <button 
                                className="view-more-btn1" 
                                onClick={() => navigate("/categories")}
                            >
                                {/* View More */}
                                    ⟩
                            </button>

                        </div>
                    )
                }

                <div className="category-grid">
                    
                    {
                        visibleCategories.map(([category, total]) => (
                            <div className="category-card" key={category} onClick={()=>navigate("/categories")}>
                                <h3> {category} </h3>
                                <p> {total} Books </p>

                            </div>
                        ))
                    }
                    
                    

                </div>
            </section>
            

        </div>
    )
}

export default Home;


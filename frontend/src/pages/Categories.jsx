import "./Categories.css";
// import { useEffect, useState } from "react";
// import API from "../services/api";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../redux/bookSlice";

import { useNavigate } from "react-router-dom";

function Categories(){

    // const [books, setBooks] = useState([]);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { books, loading, error } = useSelector(
        (state) => state.books 
    );


    useEffect(() => {
        // fetchBooks();
        if(books.length === 0){
            dispatch(fetchBooks())
        }
        
    }, [dispatch, books.length]);

    // const fetchBooks = async () => {

    //     try{

    //         const res = await API.get("/books");

    //         setBooks(res.data);

    //     } catch(err){
    //         console.log(err);
    //     }
    // };

    const categoryCount = {};

    books.forEach((book) => {

        if(categoryCount[book.category]){

            categoryCount[book.category]++;

        } else{

            categoryCount[book.category] = 1;
        }
    });

    return(

        <div className="categories-page">

            <div className="books-top">
                    
                   <p className="backbtn" onClick={()=>navigate(-1)}> ◀ </p>

                    <h1>
                        All Categories
                    </h1>

                </div>
            
            

            <div className="categories-grid">

                {
                    Object.entries(categoryCount)
                    .map(([category, total]) => (

                        <div
                            className="category-card"
                            key={category}
                        >
                            <h2>{category}</h2>

                            <p>{total} Books</p>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}

export default Categories;
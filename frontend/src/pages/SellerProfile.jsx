import "./SellerProfile.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import API from "../services/api";

function SellerProfile() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);

    const [books, setBooks] = useState([]);

    useEffect(() => {

        fetchSeller();

    }, []);

    const fetchSeller = async () => {

        try {

            const res =
                await API.get(`/users/${id}`);

            setSeller(res.data.user);

            setBooks(res.data.books);

        } catch(err) {

            console.log(err);

        }

    };

    if(!seller){

        return <h2>Loading...</h2>

    }

    return (

        <div className="seller-page">

            {/* TOP BAR */}
            <div className="seller-topbar">

                <p
                    className="backbtn1"
                    onClick={() => navigate(-1)}
                >
                    ◀
                </p>

            </div>

            {/* SELLER CARD */}
            <div className="seller-profile-card">

                <div className="seller-left">

                    <img
                        className="seller-avatar"
                        src={
                            seller.image
                            ? seller.image
                            : "https://ui-avatars.com/api/?name=" + encodeURIComponent(seller?.name || "User")
                        }
                        alt=""
                    />

                </div>

                <div className="seller-right">

                    <h1>{seller.name}</h1>

                    <p className="seller-email">
                        {seller.email}
                    </p>

                    <small>
                        Joined {
                            new Date(
                                seller.createdAt
                            ).getFullYear()
                        }
                    </small>

                    <div className="seller-stats">

                        <div className="seller-star">
                            <h3>{books.length}</h3>
                            <p>Books</p>
                        </div>

                        {/* <div>
                            <h3>12</h3>
                            <p>Exchanges</p>
                        </div>

                        <div>
                            <h3>4.8</h3>
                            <p>Rating</p>
                        </div> */}

                    </div>

                    <div className="seller-actions">

                        <button
                            className="chat-btn"
                            onClick={() => navigate(`/chat/${seller._id}`)}
                        >
                             Chat
                        </button>

                        {/* <button
                            className="follow-btn"
                        >
                            + Follow
                        </button> */}

                    </div>

                </div>

            </div>

            {/* BOOK SECTION */}

            <div className="seller-books">

                <div className="seller-books-top">

                    <h2>Books Added</h2>

                    <p>
                        {books.length} books available
                    </p>

                </div>

                <div className="seller-books-grid">

                    {
                        books.map((book) => (

                            <div
                                className="seller-book-card"
                                key={book._id}
                                onClick={() =>
                                    navigate(
                                        `/book-details/${book._id}`
                                    )
                                }
                            >

                                <img
                                    src={ book.image }
                                    alt=""
                                />

                                <h3>{book.title}</h3>

                                <p>{book.author}</p>

                                <span>
                                    ₹{book.price}
                                </span>

                                <div className={`status-badge ${book.status}`} >
                                    { book.status === "sold" || book.status === "exchanged"
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

export default SellerProfile;
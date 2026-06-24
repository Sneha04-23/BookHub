


import "./ExchangePage.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


import API from "../services/api";
import CustomModal from "../components/CustomModal";

function ExchangePage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [requestedBook, setRequestedBook] = useState(null);

    const [myBooks, setMyBooks] = useState([]);

    const [selectedBook, setSelectedBook] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [modalMessage, setModalMessage] = useState("");

    const [exchangeData, setExchangeData] = useState({

        offeredBook: "",
        extraAmount: "",
        message: ""

    });

    useEffect(() => {

        fetchRequestedBook();

        fetchMyBooks();

    }, []);

    const fetchRequestedBook = async () => {

        const res = await API.get(`/books/${id}`);

        setRequestedBook(res.data);

    };

    const fetchMyBooks = async () => {

        const res = await API.get("/books/my-books");

        const availableBooks = res.data.filter(
            book => book.status === "available"
        );

        setMyBooks(availableBooks);

    };

    const handleBookSelect = (e) => {

        const bookId = e.target.value;

        const foundBook = myBooks.find(
            (book) => book._id === bookId
        );

        setSelectedBook(foundBook);

        setExchangeData({

            ...exchangeData,

            offeredBook: bookId

        });

    };

    const handleSubmit = async () => {

        try {

            await API.post("/exchange/create", {

                requestedBook: id,
                offeredBook: exchangeData.offeredBook,
                extraAmount: exchangeData.extraAmount,
                message: exchangeData.message

            });

            setModalMessage("Exchange Request Sent ✅");

            setShowModal(true);

            setTimeout(() => {

                navigate("/profile");

            }, 1500);

        } catch(err) {

            console.log(err);

            setModalMessage(
                err.response?.data?.message || "Failed to send request"
            );

            setShowModal(true);

        }

    };

    if(!requestedBook) {

        return <h2>Loading...</h2>

    }

    return (

        <div className="exchange-page">

            <div className="exchange-card">

                <div className="title">

                    <p
                        className="backbtn"
                        onClick={() => navigate(-1)}
                    >
                        ◀
                    </p>

                    <h1>Exchange Request</h1>

                </div>

                <div className="exchange-books">

                    {/* REQUESTED BOOK */}

                    <div className="book-box">

                        <h3>Requested Book</h3>

                        <div className="book-image">

                            <img
                                src={requestedBook.image}
                                alt=""
                            />

                        </div>

                        <h2>{requestedBook.title}</h2>

                        <p>{requestedBook.author}</p>

                        <h4>₹{requestedBook.price}</h4>

                        <span className="condition">
                            {requestedBook.condition}
                        </span>

                    </div>

                    {/* SWAP ICON */}

                    <div className="swap-icon">
                        ⇄
                    </div>

                    {/* SELECTED BOOK */}

                    <div className="book-box">

                        <h3>Your Book</h3>

                        {
                            selectedBook ? (

                                <>

                                    <div className="book-image">

                                        <img
                                            src={selectedBook.image}
                                            alt=""
                                        />

                                    </div>

                                    <h2>{selectedBook.title}</h2>

                                    <p>{selectedBook.author}</p>

                                    <h4>₹{selectedBook.price}</h4>

                                    <span className="condition">
                                        {selectedBook.condition}
                                    </span>

                                </>

                            ) : (

                                <div className="empty-book">

                                    Select a book

                                </div>

                            )
                        }

                    </div>

                </div>

                <h3 className="select-title">
                    Choose Your Book
                </h3>

                <div className="my-books-grid">

                    {
                        myBooks.map((book) => (

                            <div
                                key={book._id}
                                className={`my-book-card ${
                                    exchangeData.offeredBook === book._id
                                        ? "active-book"
                                        : ""
                                }`}
                                onClick={() => {

                                    setSelectedBook(book);

                                    setExchangeData({

                                        ...exchangeData,

                                        offeredBook: book._id

                                    });

                                }}
                            >

                                <img
                                    src= {book.image}
                                    alt=""
                                />

                                <h4>{book.title}</h4>

                            </div>

                        ))
                    }

                </div>

                
                <input
                    type="number"
                    placeholder="Extra Amount"
                    value={exchangeData.extraAmount}
                    onChange={(e) =>
                        setExchangeData({

                            ...exchangeData,

                            extraAmount: e.target.value

                        })
                    }
                />

                <textarea
                    placeholder="Write a message..."
                    value={exchangeData.message}
                    onChange={(e) =>
                        setExchangeData({

                            ...exchangeData,

                            message: e.target.value

                        })
                    }
                />

                <div className="exchange-btns">

                    <button
                        className="send-btn"
                        onClick={handleSubmit}
                        disabled={!exchangeData.offeredBook}
                    >
                        Send Request
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                </div>

            </div>

            {
                showModal && (

                    <CustomModal
                        message={modalMessage}
                        onClose={() =>
                            setShowModal(false)
                        }
                    />

                )
            }

        </div>

    );
}

export default ExchangePage;

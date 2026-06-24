
import "./Profile.css";
import API from "../services/api"
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { fetchBooks } from "../redux/bookSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWishlist } from "../redux/wishlistSlice";
// import Order from "../../../backend/models/Order";

function Profile(){

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [myBooks, setMyBooks] = useState([])

    const { user } = useSelector((state) => state.auth);
    const { books } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchWishlist());
        fetchNotifications();
        fetchMessages();
        fetchMyBooks()
    }, [dispatch])

    const { wishlist } =useSelector(
        (state) => state.wishlist
    );

    const fetchMyBooks = async () => {
        try {
            const res = await API.get("/books/my-books");
            setMyBooks(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // const userBooks = books.filter(
    //     (book) => String(book.seller?._id) === String(user?.id) 
    // );

    const userBooks = myBooks;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login")
    };

    const soldBooks = userBooks.filter(
        book => 
            book.status?.toLowerCase() === "sold" ||
            book.status?.toLowerCase() === "exchanged"
    );

    const fetchMessages = async () => {
        try{
            const res = await API.get("/messages")
            setMessages(res.data);
        } catch (err){
            console.log(err)
        }
    }

    const fetchNotifications = async () => {
        try{
            const res = await API.get("/orders/notifications")
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount)
        } catch(err){
            console.log(err)
        }
    }

   

    return (
        <div className="profile-page">
            {/* SIDE BAR */}
            <div className="profile-sidebar">
                <h1 className="profile-logo">BookHub</h1>

                <div className="slidebar-links">
                    <p onClick={() => navigate("/")}>Home</p>

                    <p onClick={() => navigate("/books")}>Books</p>
                    <p onClick={() => navigate("/add-book")}>Add Book</p>
                    <p onClick={() => navigate("/wishlist")}>Wishlist</p>
                    <p onClick={() => navigate("/my-orders")}>My Orders</p>
                    <p onClick={() => navigate("/seller-orders")}> Orders Get</p>
                    <p onClick={() => navigate("/my-exchanges")}>My Exchanges</p>

                    {
                        user?.role === "admin" && (

                            <p className="admin-profile"
                                onClick={() => navigate("/admin")}
                            >
                                Admin Dashboard
                            </p>

                        )
                    }

                    <p onClick={handleLogout} className="logout-btn1">Logout</p>

                </div>

            </div>

            <div className="profile-content">

                <div className="profile-topbar">

                    <div className="topbar-search">

                        {/* <input
                            type="text"
                            placeholder="Search books..."
                        /> */}

                    </div>

                    <div className="topbar-right">

                        <div className="topbar-icon" onClick={() => navigate("/notification")}>
                            🔔
                            {unreadCount >0 && (
                                <span>{unreadCount} </span>
                            )}
                        </div>

                        <div className="topbar-icon" onClick={() => navigate("/chats")}>
                            💬
                           {messages.length > 0 &&(
                                <span>{messages.length} </span>
                            )}
                        </div>

                        <div className="topbar-user">

                            <img
                                src={
                                    user?.image
                                    ? user.image
                                    :  "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")
                                }
                                alt={user?.name}
                            />

                            <p>{user?.name}</p>

                        </div>

                    </div>

                </div>


                {/* TOP CARD */}
                <div className="profile-top-card">

                {/* USER CARD */}
                <div className="profile-user">

                    <div className="profile-user-details">

                        <div className="person-info">

                            <img
                                src={
                                    user?.image
                                    ? user.image
                                    :  "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")
                                }
                                alt={user?.name}
                            />

                            <div>
                                <h2>{user?.name}</h2>
                                <p>{user?.email}</p>
                                <small>{user?.location}</small>
                            </div>

                        </div>

                        <div className="profile-buttons">
                            <button
                                className="edit-btn"
                                onClick={() => navigate("/edit-profile")}
                            >
                                Edit Profile
                            </button>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>

                    </div>

                    <hr />

                    <div className="stats-grid">

                        <div className="stat-card">
                            <h2>{myBooks.length}</h2>
                            <p>Books Listed</p>
                        </div>

                        <div className="stat-card">
                            <h2> {soldBooks.length} </h2>
                            <p>Books Sold</p>
                        </div>

                        <div className="stat-card" onClick={() => navigate("/wishlist")}>
                            <h2>{wishlist.length}</h2>
                            <p>Wishlist</p>
                        </div>

                        {/* <div className="stat-card">
                            <h2>0</h2>
                            <p>Reviews</p>
                        </div> */}

                    </div>

                </div>

                {/* MY BOOKS */}
                <div className="my-books-section">

                    <div className="section-top">

                        <h2>My Books</h2>

                        {/* <h2>{JSON.stringify(myBooks.map(book => book.status))}</h2> */}

                        <button onClick={() => navigate("/add-book")}>
                            + Add Book
                        </button>

                    </div>

                    <div className="profile-books-grid">

                        {
                            myBooks.length > 0 ? (
                                myBooks.map((book) => (
                                    <div
                                        className="profile-book-card"
                                        key={book._id}
                                        onClick={() =>
                                            navigate(`/book-details/${book._id}`)
                                        }
                                    >
                                        
                                    
                                        <div className="book-">
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                
                                            />

                                            <h3>{book.title}</h3>

                                            <p>{book.author}</p>

                                            <span>₹{book.price}</span>
                                        </div>
                                        
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
                            ) : (
                                <p>No books added yet.</p>
                            )
                        }

                    </div>

                </div>

            </div>

            </div>

        </div>
    )
}

export default Profile;


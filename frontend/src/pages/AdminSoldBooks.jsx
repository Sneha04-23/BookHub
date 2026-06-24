import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";
import "./AdminSoldBooks.css"

function AdminSoldBooks() {

    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSoldBooks();
    }, []);

    const fetchSoldBooks = async () => {
        const res = await API.get("/admin/sold-books");
        setBooks(res.data);
    };
    

    return (
        <div className="admin-container">

            <div className="sidebar-admin">
                <div className="logo1">
                    <h1>BookHub</h1>
                    <p>Admin</p>
                </div>

                <ul className="menu1">
                    <li onClick={() => navigate("/admin")}><FaHome /> Dashboard</li>
                    <li onClick={() => navigate("/admin/users")}><FaUsers /> Users</li>
                    <li onClick={() => navigate("/admin/books")}><FaBook /> Books</li>
                    <li onClick={() => navigate("/admin/orders")}> <FaShoppingCart />  Orders </li>
                    <li onClick={() => navigate("/admin/exchanges")}> <FaExchangeAlt /> Exchanges </li>
                    <li className="active"> <FaCheckCircle /> Sold Books </li>
                    <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 
                </ul>
            </div>

            <div className="main-content1">

                <div className="page-header">
                    <h2>Sold Books</h2>
                    <p>All completed and exchanged books in the system</p>
                </div>

                {books.length === 0 ? (
                    <div className="empty-state">
                        📚 No sold books yet
                    </div>
                ) : (
                    <div className="sold-grid">

                        {books.map(book => (

                            
                                
                            <div key={book._id} className="sold-card">

                                <div className="book-top">

                                    <div className="book-info-asd">
                                        <h4>{book.title}</h4>
                                    <div className="book-img-asd">
                                        <img
                                            src={  book.image || "https://placehold.co/150x200?text=No+Image" }
                                            alt=""
                                        />
                                    </div>
                                        <span className={`status ${book.status}`}>
                                            {book.status}
                                        </span>

                                    </div>

                                </div>

                                <div className="seller-box">

                                    <img
                                        src={  book.seller.image || 
                                            "https://ui-avatars.com/api/?name=" + encodeURIComponent(book.seller?.name || "User")  }
                                        alt=""
                                    />

                                    <div>
                                        <p className="label">Seller</p>
                                        <h5>{book.seller?.name}</h5>
                                    </div>

                                </div>

                                <div className="meta">
                                    <span> Sold Item</span>
                                    <span>✔ Verified Exchange</span>
                                </div>

                            </div>

                        ))}

                    </div>
                )}
            </div>

        </div>
    );
}

export default AdminSoldBooks;
import { useEffect, useState } from "react";
import API from "../services/api";
import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminBooks.css"
    import ConfirmModal from "../components/ConfirmModal";

function AdminBooks() {

    const navigate = useNavigate()
    const [books,setBooks] = useState([]);


const [modalOpen, setModalOpen] = useState(false);
const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetchBooks();
    },[]);

    const fetchBooks = async() => {

        const res = await API.get("/admin/books");
        setBooks(res.data);
    };

    const deleteBook = async(id) => {

        await API.delete(`/admin/books/${id}`);

        fetchBooks();
    };

    const confirmDelete = async () => {
        await API.delete(`/admin/books/${selectedBook}`);
        setModalOpen(false);
        setSelectedBook(null);
        fetchBooks();
    };

    return (

        <div className="admin-container" >
            {/* Sidebar */}
                  <div className="sidebar-admin">
                    <div className="logo1">
                      <h1>BookHub</h1>
                      <p>Admin</p>
                    </div>
            
                    <ul className="menu1">
            
                      <li onClick={() => navigate("/admin")}> <FaHome /> Dashboard  </li>
                      <li  onClick={() => navigate("/admin/users")}> <FaUsers /> Users </li>
                      <li className="active" > <FaBook /> Books </li>
                      <li onClick={() => navigate("/admin/orders")}>  <FaShoppingCart />  Orders </li>
                      <li onClick={() => navigate("/admin/exchanges")}>  <FaExchangeAlt />  Exchanges </li>
                      <li onClick={() => navigate("/admin/sold-books")}> <FaCheckCircle /> Sold Books </li>
                      <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 

                    </ul>
                  </div>
            
                  {/* Main Content */}
            <div className="books-grid-ad">

                <h2 className="page-title" >All Books</h2>
                <div className="grid-book">
                    {books.map(book => (
                        

                        <div key={book._id} className="book-card-ad">

                            <div className="book-img-ad">
                                <img
                                src={
                                    book.image || "https://placehold.co/150x200?text=No+Image"
                                }
                                alt=""
                                />
                            </div>
                            <div className="book-info-ad">
                            <h4>{book.title}</h4>

                                <p className="seller-name">{book.seller?.name}</p>
                                <span className={`status-badge ${book.status}`} >{book.status}</span>
    
                            </div>
                            
                            <button className="delete-btn1"
                                onClick={() =>{
                                    setSelectedBook(book._id);
                                    setModalOpen(true)
                                }}
                            >
                                Delete
                            </button>

                        </div>

                    ))} 
                </div>
                
            </div>
            <ConfirmModal
                open={modalOpen}
                title="Delete Book"
                message="This action will permanently remove the book."
                onCancel={() => setModalOpen(false)}
                onConfirm={confirmDelete}
            />

        </div>
    );
}

export default AdminBooks;
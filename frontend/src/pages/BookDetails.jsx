// import CustomModal from "../components/CustomModal";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import "./BookDetails.css"

function BookDetails(){

    const { id } = useParams();

    const dispatch = useDispatch();

    const { wishlist } = useSelector(
        (state) => state.wishlist
    );

    

    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    // const [modalMessage, setModalMessage] = useState("");
    // const [showModal,setShowModal] = useState(false);

    useEffect(() => {
        fetchBook();
        dispatch(fetchWishlist());
        
    }, [dispatch, id]);
    
    const isWishlisted = book 
        ?wishlist.some((item) => item._id === book._id)
        : false;

    const fetchBook = async () => {
        try{

            const res = await API.get(`/books/${id}`);

            setBook(res.data);

        } catch(err){
            console.log(err);
        }
    };


    const { user } = useSelector(
        (state) => state.auth
    );

    const isOwner =
        user?.id === book?.seller?._id;


    // const discount = {book.price}/{book.mrp} *100 

    if(!book){
        return <h2>Loading...</h2>
    }

    return(
        <div className="detail-page">
            <div className="breadcrumb">
                <p onClick={() => navigate("/")}>Home</p>

                <span> &gt; </span>

                <p onClick={() => navigate("/books")}>
                    Books
                </p>

                <span> &gt; </span>

                <p className="active-page">
                    {book.title}
                </p>
            </div>

            <section className="book-part">

                <div className="book-left">

                    <img
                            src={book.image}
                            alt={book.title}
                     /> 

                </div>

                <div className="detail-right">
                    <div className="title-card">
                        <h1>{book.title}</h1>

                        <p>by <span>{book.author}</span></p>
                    </div>    
                    
                    <div className="price-card">
                        <h3> ₹{book.price} </h3>
                        <h5> ₹{book.mrp} </h5>
                        <small className="discount">
                            ({Math.round(
                                ((book.mrp - book.price) / book.mrp) * 100
                            )}% OFF)
                        </small>
                    </div>
                    

                    <div className="profile-card" onClick={
                                () =>{
                                    if(user?.id === book?.seller?._id){
                                        navigate("/profile")
                                    }else{
                                         navigate(`/seller/${book.seller._id}`)
                                    }
                                }
                            }
                    >
                        <div className="profile-card-left">
                            <img 
                                src={
                                    book?.seller?.image
                                    ? book.seller.image
                                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(book.seller?.name || "User")
                                } 
                                alt={book.seller.name}
                            />
                        </div>
                        <div  className="profile-card-right">
                            <h4>Sold by <span>{book.seller.name}</span></h4>
                            <small> Member since {new Date(book.createdAt).getFullYear()} </small>
                        </div>
                        

                    </div>
                    
                    <div className="bookbtn">
                        
                        {
                            book.status === "sold" || book.status === "reserved" ? (
                                <button className="sold-btn"
                                    disabled
                                >
                                   {book.status === "sold"
                                        ?" SOLD OUT"
                                        : "RESERVED"
                                    }
                                </button>
                            ) : (
                                !isOwner && (
                                    <div className="bookbtn">

                                        <button className="chat-btn" onClick={()=> navigate(`/chat/${book.seller._id}`) }>Chat with Seller</button>


                                        <button
                                            className="buy-btn"
                                            onClick={() => navigate(`/checkout/${book._id}`) }
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                )
                            )
                        }

                    </div>
                    <div className="add-exch">
                        <button className="add-wish"  onClick={() => isWishlisted
                            ? dispatch(removeFromWishlist(book._id))
                            : dispatch(addToWishlist(book._id))
                        }
                            
                        >
                            {isWishlisted? " ❤️ Remove Wishlist":" 🤍 Add to Wishlist"}
                        </button>

                        {  book.status === "sold" || book.status === "reserved" ? (
                                <button className="exchange-btn"
                                    disabled
                                >
                                   {book.status === "sold"
                                        ?" Sold Out"
                                        : "Exchange Book"
                                    }
                                </button>
                            )
                            :(!isOwner && (
                                <button 
                                    className="exchange-btn"
                                    onClick={() => navigate(`/exchange/${book._id}`)}
                                >
                                    Exchange Book
                                </button>
                            ))
                        }
                    </div>
                    

                </div>
                

            </section>
            <hr />

            <section className="book-details">
                <div>
                    <h2>Book Details</h2>
                    <div className="detail-top">
                        <h4 className="detail-item">Category: <span>{book.category}</span></h4>
                        <h4 className="detail-item">Condition: <span>{book.condition}</span></h4>
                        <h4 className="detail-item">Published Year: <span>{book.publishedYear}</span></h4>
                        <h4 className="detail-item">Languge: <span>{book.language}</span></h4>
                        <h4 className="detail-item">MRP: <span>{book.mrp}</span></h4>
                        <h4 className="detail-item">Pages: <span>{book.pages}</span></h4>
                    </div>
                </div>
               
                <div className="description-section">
                    <h2>Description</h2>

                    <p> {book.description} </p>
                </div>


            </section>

            

            

            {/* {
                showModal && (
                    <CustomModal
                        message={modalMessage}
                        onClose={() => setShowModal(false)}
                    />
                )
            } */}

        </div>
    )
}

export default BookDetails;


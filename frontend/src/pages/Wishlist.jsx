import "./Wishlist.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Wishlist() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { wishlist } = useSelector(
        (state) => state.wishlist
    );

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch])
    return (
        <div className="wishlist-page">
            <div className="title">
                <p className="backbtn" onClick={()=>navigate(-1)}> ◀ </p>
                <h1>My Wishlist ❤️</h1>
            </div>
            

            <div className="wishlist-grid">

                {
                    wishlist.length > 0 ? (

                        wishlist.map((book) => (

                            <div
                                className="wishlist-card"
                                key={book._id}
                            >
                                <div className="wishlistImg" >
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        onClick={() =>
                                            navigate(`/book-details/${book._id}`)
                                        }
                                    />
                                </div>

                                <div>
                                    <h3>{book.title}</h3>

                                    <p>{book.author}</p>

                                    <span>₹{book.price}</span>
                                </div>
                                
                                 {/* STATUS BADGE */}
                                <div className={`status-badge ${book.status}`}>
                                    {book.status === "sold"
                                        ? "SOLD OUT"
                                        : book.status === "reserved"
                                        ? "RESERVED"
                                        : "AVAILABLE"}
                                </div>

                                <button
                                    onClick={() =>
                                        dispatch(
                                            removeFromWishlist(book._id)
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        ))

                    ) : (

                        <p>No wishlist books yet.</p>

                    )
                }

            </div>

        </div>
    );
}

export default Wishlist;
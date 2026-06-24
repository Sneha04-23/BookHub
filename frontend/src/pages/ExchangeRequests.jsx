import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./ExchangeRequests.css"

function MyExchangeRequests() {

    const [exchanges, setExchanges] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExchanges();
    }, []);

    const { user} = useSelector(
        (state) => state.auth
    )

    const fetchExchanges = async () => {
        const res = await API.get("/exchange/my-exchanges");
        setExchanges(res.data);
    };

    const handleAccept = async(id) => {
        await API.put(`/exchange/accept/${id}`);
        fetchExchanges();
    };

    const handleReject = async(id) => {
        await API.put(`/exchange/reject/${id}`);
        fetchExchanges();
    };

    return (
        <div className="exchange-container">
            <div className="tob-bar">
            <p className="back-btn" onClick={() => navigate("/profile")} > ◀ </p>

                <h2 className="exchange-heading">Exchange Requests</h2>



            </div>

            {exchanges.length === 0 ? (

                <div className="empty-box">
                    No Exchange Requests
                </div>

            ) : (

                exchanges.map((exchange) => (

                    <div
                        key={exchange._id}
                        className="exchange-card"
                    >
                        <div className="users-owner">
                        <div className="user-section">

                            <img
                                src={
                                    exchange.requester?.image
                                        ?  exchange.requester.image
                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.requester?.name || "User")
                                }
                                alt=""
                            />

                            <div>
                                <h3>
                                    {exchange.requester?.name}
                                </h3>
                                

                                <span className={`status ${exchange.status.toLowerCase()}`}>
                                    {exchange.status}
                                </span>
                            </div>

                        </div>
                        <div className="user-section">

                            <img
                                src={
                                    exchange.owner?.image
                                        ? exchange.owner.image
                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.owner?.name || "User")
                                }
                                alt=""
                            />

                            <div>
                                <h3>
                                    {exchange.owner?.name}
                                </h3>

                                <span className={`status ${exchange.status.toLowerCase()}`}>
                                    {exchange.status}
                                </span>
                            </div>

                        </div>
                        </div>

                        

                        <div className="books-section">

                            <div className="book-box">
                                <p>Requested</p>
                                <h4>
                                    {exchange.requestedBook?.title}
                                </h4>
                            </div>

                            <div className="swap-icon">
                                ⇄
                            </div>

                            <div className="book-box">
                                <p>Offered</p>
                                <h4>
                                    {exchange.offeredBook?.title}
                                </h4>
                            </div>

                        </div>
                        <div className="exchange-details">

                            {exchange.extraAmount > 0 && (
                                <p>
                                    <strong>Extra Amount:</strong> <span> ₹{exchange.extraAmount} </span>
                                </p>
                            )}

                            {exchange.message && (
                                <p>
                                    <strong>Message:</strong> <span> {exchange.message} </span>
                                </p>
                            )}

                        </div>

                        {exchange.status === "Pending" &&
                         exchange.owner?._id === user?.id && (

                            <div className="action-buttons">

                                <button
                                    className="accept-btn"
                                    onClick={() =>
                                        handleAccept(exchange._id)
                                    }
                                >
                                    Accept
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={() =>
                                        handleReject(exchange._id)
                                    }
                                >
                                    Reject
                                </button>

                            </div>

                        )}

                    </div>

                ))
            )}

        </div>
    );
}

export default MyExchangeRequests;



import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./ExchangeRequests.css";
import "./MyExchanges.css"

function MyExchanges() {

    const [exchanges, setExchanges] = useState([]);
    const navigate = useNavigate();

    const { user } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        try {
            const res = await API.get(
                "/exchange/my-exchanges"
            );
            // console.log(res.data)

            setExchanges(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    const handleAccept = async (id) => {
        try {

            await API.put(
                `/exchange/accept/${id}`
            );

            fetchExchanges();

        } catch (err) {
            console.log(err);
        }
    };

    const handleReject = async (id) => {
        try {

            await API.put(
                `/exchange/reject/${id}`
            );

            fetchExchanges();

        } catch (err) {
            console.log(err);
        }
    };

    const updateStatus = async (
        exchangeId,
        status
    ) => {
        try {

            await API.put(
                `/exchange/update-status/${exchangeId}`,
                { status }
            );

            fetchExchanges();

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="exchange-container">

            <div className="tob-bar">

                <p
                    className="back-btn"
                    onClick={() =>
                        navigate("/profile")
                    }
                >
                    ◀
                </p>

                <h2 className="exchange-heading">
                    Exchange Requests
                </h2>

            </div>

            {exchanges.length === 0 ? (

                <div className="empty-box">
                    No Exchange Requests
                </div>

            ) : (

                exchanges.map((exchange) => {

                    const isRequester =
                        exchange.requester?._id ===
                        user?.id;
                    const isOwner = exchange.owner?._id === user?.id;
                    const myStatus = isRequester
                        ? exchange.requesterStatus
                        : exchange.ownerStatus;

                    const otherStatus = isRequester
                        ? exchange.ownerStatus
                        : exchange.requesterStatus;

                    return (

                        <div
                            key={exchange._id}
                            className="exchange-card"
                        >

                            <div className="user-section">

                                <img
                                    src={
                                            isOwner
                                                ? (
                                                    exchange.owner?.image
                                                        ?  exchange.owner.image
                                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.owner?.name || "User")
                                                )
                                                : (
                                                    exchange.requester?.image
                                                        ?  exchange.requester.image
                                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.requester?.name || "User")
                                                )
                                        }
                                        alt=""
                                />

                                <div>

                                    <h3>
                                        { 
                                            isOwner
                                                    ? exchange.owner?.name
                                                    : exchange.requester?.name
                                        }
                                    </h3>

                                    <span
                                        className={`status ${exchange.status.toLowerCase()}`}
                                    >
                                        {
                                            exchange.status
                                        }
                                    </span>

                                </div>

                            </div>
                            <div className="other-user-card">

                                <h4>Exchange Partner</h4>

                                <div className="partner-info">

                                    <img
                                        src={
                                            isRequester
                                                ? (
                                                    exchange.owner?.image
                                                        ? exchange.owner.image
                                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.owner?.name || "User")
                                                )
                                                : (
                                                    exchange.requester?.image
                                                        ? exchange.requester.image
                                                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(exchange.requester?.name || "User")
                                                )
                                        }
                                        alt=""
                                    />

                                    <div>
                                        <h3>
                                            {
                                                isRequester
                                                    ? exchange.owner?.name
                                                    : exchange.requester?.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                isRequester
                                                    ? "Book Owner"
                                                    : "Requester"
                                            }
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="books-section">

                                <div className="book-box">

                                    <p>
                                        Requested
                                    </p>

                                    <h4>
                                        {
                                            exchange
                                                .requestedBook
                                                ?.title
                                        }
                                    </h4>

                                </div>

                                <div className="swap-icon">
                                    ⇄
                                </div>
                                

                                <div className="book-box">

                                    <p>
                                        Offered
                                    </p>

                                    <h4>
                                        {
                                            exchange
                                                .offeredBook
                                                ?.title
                                        }
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

                            <div className="exchange-progress" >
                                <h4>Exchange Progress</h4>

                                <div className="progress-row">
                                        <span> Your Status</span>

                                        <span className={`status-bandge${myStatus?.toLowerCase()}`} >
                                            {myStatus || "Pending"}
                                        </span>
                                </div>

                                <div className="progress-row">
                                        <span> Other User</span>
                                        <span className={`status-badge${otherStatus?.toLowerCase()}`}>
                                            {otherStatus || "Pending"}
                                        </span>
                                </div>

                            </div>

                            {/* ACCEPT / REJECT */}

                            {exchange.status ===
                                "Pending" &&
                                exchange.owner?._id ===
                                user?.id && (

                                    <div className="action-buttons">

                                        <button
                                            className="accept-btn"
                                            onClick={() =>
                                                handleAccept(
                                                    exchange._id
                                                )
                                            }
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                handleReject(
                                                    exchange._id
                                                )
                                            }
                                        >
                                            Reject
                                        </button>

                                    </div>

                                )}

                            {/* SHIPPING STATUS */}

                            {exchange.status ===
                                "Accepted" && (

                                    <div
                                        className="action-buttons"
                                    >

                                        {myStatus ===
                                            "Pending" && (

                                                <button className="ship-btn"
                                                    onClick={() =>
                                                        updateStatus(
                                                            exchange._id,
                                                            "Shipped"
                                                        )
                                                    }
                                                >
                                                    Mark Shipped
                                                </button>

                                            )}

                                        {myStatus ===
                                            "Shipped" && (

                                                <button className="receive-btn"
                                                    onClick={() =>
                                                        updateStatus(
                                                            exchange._id,
                                                            "Received"
                                                        )
                                                    }
                                                >
                                                    Mark Received
                                                </button>

                                            )}

                                    </div>

                                )}

                            {exchange.status ===
                                "Completed" && (

                                    <div
                                        className="completed-box"
                                    >
                                        ✅ Exchange
                                        Completed
                                    </div>

                                )}
                            <div className="tracker">

                                <div
                                    className={`step ${
                                        myStatus === "Shipped" ||
                                        myStatus === "Received"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Shipped
                                </div>

                                <div
                                    className={`step ${
                                        myStatus === "Received"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Received
                                </div>

                            </div>

                        </div>

                    );

                })

            )}

        </div>
    );
}

export default MyExchanges;


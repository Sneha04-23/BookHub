import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";

import "./AdminExchanges.css"

function AdminExchanges() {

    const [exchanges, setExchanges] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        const res = await API.get("/admin/exchanges");
        setExchanges(res.data);
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
                    <li className="active"> <FaExchangeAlt /> Exchanges </li>
                    <li onClick={() => navigate("/admin/sold-books")}> <FaCheckCircle /> Sold Books </li>
                    <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 
                </ul>
            </div>

            <div className="main-content1">

                <div className="page-header">
                    <h2>Exchange History</h2>
                    <p>All book exchange transactions in the system</p>
                </div>

                {exchanges.length === 0 ? (
                    <div className="empty-state">
                        No exchanges found
                    </div>
                ) : (
                    <div className="exchange-grid-ad">

                        {exchanges.map(ex => (

                            <div key={ex._id} className="exchange-card-ad">

                                <div className="exchange-top">

                                    <span className={`status-chip ${ex.status?.toLowerCase()}`}>
                                        {ex.status}
                                    </span>

                                </div>

                                <div className="exchange-body-ad">

                                    <div className="book-block">
                                        <p>Requested Book</p>
                                        <h4>{ex.requestedBook?.title}</h4>
                                    </div>

                                    <div className="swap-icon1">⇄</div>

                                    <div className="book-block">
                                        <p>Offered Book</p>
                                        <h4>{ex.offeredBook?.title}</h4>
                                    </div>

                                </div>

                                <div className="exchange-users">

                                    <div>
                                        <span>Requester</span>
                                        <h5>{ex.requester?.name}</h5>
                                    </div>

                                    <div>
                                        <span>Owner</span>
                                        <h5>{ex.owner?.name}</h5>
                                    </div>

                                </div>

                                <div className="exchange-footer">
                                    <small>
                                        ID: {ex._id.slice(-6)}
                                    </small>
                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default AdminExchanges;
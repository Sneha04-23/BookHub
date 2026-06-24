import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";

import "./AdminOrders.css";

function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/admin/orders");
            setOrders(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="admin-orders">

            <div className="sidebar-admin">
                <div className="logo1">
                <h1>BookHub</h1>
                <p>Admin</p>
                </div>

                <ul className="menu1">

                <li onClick={() => navigate("/admin")}> <FaHome /> Dashboard  </li>
                <li onClick={() => navigate("/admin/users")} > <FaUsers /> Users </li>
                <li onClick={() => navigate("/admin/books")}> <FaBook /> Books </li>
                <li className="active"> <FaShoppingCart />  Orders </li>
                <li onClick={() => navigate("/admin/exchanges")}> <FaExchangeAlt /> Exchanges </li>
                <li onClick={() => navigate("/admin/sold-books")}> <FaCheckCircle /> Sold Books </li>
                <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content1">

                <h2>All Orders </h2>

                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-card1">

                            <div>
                                <h3>{order.book?.title}</h3>
                                <p>₹{order.book?.price}</p>
                            </div>

                            <div>
                                <p><b>Buyer:</b> {order.buyer?.name}</p>
                                <p>{order.buyer?.email}</p>
                            </div>

                            <div>
                                <p><b>Seller:</b> {order.book?.seller?.name}</p>
                                <p>{order.book?.seller?.email}</p>
                            </div>

                            <div>
                                <p>Status: {order.status}</p>
                                <small>
                                    {new Date(order.createdAt).toLocaleString()}
                                </small>
                            </div>

                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default AdminOrders;
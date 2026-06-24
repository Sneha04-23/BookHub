import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./SellerOrders.css";

function SellerOrders() {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders  = async() => {
        try{

            const res = await API.get("/orders/seller-orders");
            
            setOrders(res.data);
        } catch(err){
            console.log(err)
        };
    }

    const updateStatus = async (orderId, status) =>{
        try{
            await API.put(`/orders/update-status/${orderId}`, {
                status 
            });
            fetchOrders()
        } catch(err) {
            console.log(err);
        }
    }
    return(

        <div className="seller-orders-page">
            <div className="top-bar">
                <button className="back-btn"
                    onClick={()=> navigate("/profile")}
                >
                    ◀
                </button>
                <h2>Orders Received</h2>
            </div>
            

            { orders.length === 0 ? (
                <div className="empty">
                    <p>No Orders Yet</p>
                </div>
                
            ) : (
                <div className="order-grid">
                    {orders.map(order => (
                        <div className="orders-card" key ={order._id}>
                            
                            <div className="order-info">
                                <img src={order.book?.image }
                                 alt={order.book?.title} />
                                 <div className="book-info">
                                    <h3>{order.book?.title} </h3>
                                    <p className="auhtor">{order.book?.author} </p>
                                    <p className="price">₹{order.book?.price} </p>
                                 </div>
                                
                            </div>
                            <p className="buyer">Buyer: {order.buyer?.name} </p>
                            <div className="order-metas">
                                <div className="order-meta">
                                    <span>📍 {order.address}</span>
                                    <span> {order.city}</span>
                                    <span> {order.pincode}</span>
                                </div>
                                
                                <div className="order-meta">
                                    <span> 📞 {order.phone}</span>
                                </div>

                                <div className="order-meta">
                                    <span>💳 {order.paymentMethod}</span>
                                </div>
                                
                                
                            </div>
                            <p className={`status ${order.status}`}>Status: {order.status} </p>

                            <select value={order.status} 
                                disabled ={
                                            order.status === "Delivered" || 
                                            order.status === "Cancelled"
                                        }
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                            >

                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            
                        </div>
                    ))}
                </div>
                
            )}

        </div>
    )

}

export default SellerOrders;
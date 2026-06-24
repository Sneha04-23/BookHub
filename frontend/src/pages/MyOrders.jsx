import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api"

import "./MyOrders.css"

function MyOrders() {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    },[]);

    const fetchOrders = async () => {
        try{
            const res = await API.get("/orders/my-orders");
            setOrders(res.data);
        } catch(err) {
            console.log(err);
        }
    }

    const cancelOrder = async(id) => {
        try{
            await API.put(`/orders/cancel/${id}`);

            fetchOrders();
        } catch(err) {
            console.log(err);
        }
    }



    return(

        <div className="orders-page">
            <div className="orders-header">
                <button className="back-btn" onClick={() => navigate("/profile")}>◀</button>
                <h2>My Order</h2>
            </div>
            

            {orders.length === 0? (
                <div className="empty-orders">
                    <h3>No orders Yet</h3>
                    <p>You haven't placed orders yet.</p>
                </div>
                
            ):(
            <div className="orders-grid">  
                {orders.map(order => (
                    <div 
                        key={order._id} 
                        className="order-card"
                    >
                        <img 
                            src={ order.book?.image } 
                            alt={order.book?.title} 
                        />
                        
                        <div className="book-details">

                            <div className="book">
                                <h3> {order.book?.title} </h3>
                                <p className="author">{order.book?.author} </p>
                                <p className="price">₹ {order.price} </p>
                            </div>
                            <div className="seller">
                                <p >
                                Seller: {order.seller?.name}
                            </p>
                            </div>
                            
                            <p className="date">Ordered :
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <span className={`status ${order.status}`} >
                                Status:{order.status} 
                            </span>

                            {order.status ==="Pending" && (
                                <button
                                    className="cancel-btn_" onClick={() => cancelOrder(order._id)}
                                >
                                    Cancel Order
                                </button>
                            )

                            }
                        </div>

                        
                    </div>
                ))}
            </div> 
            )

            }

        </div>
    )
}

export default MyOrders;


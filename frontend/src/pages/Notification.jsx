import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Notification.css"

function Notification() {

    const [notification, setNotification] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetchNotification();
        markAsRead()
    }, []);

    const fetchNotification = async() => {
        const res = await API.get("/orders/notifications");
        setNotification(res.data.notifications);
    };

    const markAsRead = async () => {
        try{
            await API.put("/orders/notification/read")
        } catch(err){
            console.log(err);
        }
    }

    const handleNotificationClick = (notification) => {

        if(notification.type === "exchange"){
            navigate("/my-exchangeRequests");
        } 

    };

    return(

        <div className="notification-page">
            <div className="top-bar" >
                <button className="back-btn" onClick={() => navigate(-1)}>◀</button>
                <h2>Notification</h2>
            </div>
            {notification.length === 0? (
                <div className="empty-box">
                    <p>No notification yet</p>
                </div>
            ):(
                <div className="notification-list">                
                    {
                        notification.map((item) => (
                            <div key = {item._id} 
                                className={`notification-card ${item.isRead ? "read" :"unread"}`}
                                onClick={() => handleNotificationClick(item)}
                            >
                                <div className="content">
                                    <p>{item.message} </p>
                                    <small>{new Date (item.createdAt).toLocaleDateString()} </small>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default Notification;


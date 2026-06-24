import "./Chats.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import API from "../services/api";

function Chats() {

    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);

    const { user } = useSelector(
        (state) => state.auth
    );


    useEffect(() => {

        if(user?.id) {
            fetchChats();

        }

    }, [user]);

    const fetchChats = async () => {

        try {

            const res = await API.get(
                `/messages/conversations/${user.id}`
            );

            setConversations(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="chats-page">

            <div className="chat-sidebar">

                <div className="chat-sidebar-top">

                    <button
                        className="chat-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        ◀
                    </button>

                    <h2>Messages</h2>

                </div>

                {
                    conversations.length > 0 ? (
                        conversations.map((chat) => (
                            <div
                                key ={chat.sellerId}
                                className="chat-user"
                                onClick={() => navigate(`/chat/${chat.sellerId}`)}
                            >
                                <img 
                                    src={
                                        chat.image
                                        ? chat.image
                                        :"https://ui-avatars.com/api/?name=" + encodeURIComponent(chat?.name || "User")
                                    } 
                                    alt="" 
                                
                                />

                                <div className="chat-user-info">

                                    <div className="chat-user-top">

                                        <h4> {chat.name} </h4>

                                        <span> {chat.time || ""} </span>

                                    </div>

                                    <p> {chat.lastMessage} </p>

                                    {
                                        chat.unreadCount > 0 && (
                                            <div className="unread-badge">
                                                {chat.unreadCount}
                                            </div>
                                        )
                                    }

                                </div>
                            </div>
                        ))
                    ):(

                        <div className="no-chat">

                            <h3>No Conversations Yet</h3>

                            <p>Start chatting with seller </p>

                        </div>
                    )
                }

                
            </div>
            <div className="chat-empty">
                <h2> Select a conversation</h2>
            </div>

        </div>

    );

}

export default Chats;


import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import socket from "../socket";
import API from "../services/api";

import "./Chat.css";

function Chat() {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [seller, setSeller] = useState(null);

    const bottomRef = useRef(null);

    const navigate = useNavigate();

    const { user } = useSelector(
        (state) => state.auth
    );

    const { sellerId } = useParams();

    useEffect(() => {

        if(user?.id && sellerId){
            fetchMessages();
            fetchSeller();
            markMessagesAsRead()
        }

        socket.on("receiveMessage", (data) => {

            if (
                (String(data.sender) === String(user.id) &&
                String(data.receiver) === String(sellerId) )

                ||

                ( String(data.sender) === String(sellerId) &&
                 String(data.receiver) === String(user.id) )
            ) {

                setMessages((prev) => {
                    
                    const exists = prev.some(
                        (msg) => msg._id === data._id 
                    );

                    if(exists) return prev;

                    return [...prev,data]
                });

            }

        });

        return () => {
            socket.off("receiveMessage");
        };

    }, [sellerId, user?.id]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const fetchMessages = async () => {

        try {

            const res = await API.get(
                `/messages/${user.id}/${sellerId}`
            );

            setMessages(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const fetchSeller = async() => {
        try{

            const res = await API.get(
                `/users/${sellerId}`
            );

            setSeller(res.data.user);
        } catch(err) {
            console.log(err);
        }
    };

    const sendMessage = () => {

        if (!input.trim()) return;

        if (!user?.id || !sellerId) {

            console.log("Missing sender or receiver");

            return;

        }

        // const tempMessage = {
        //     _id: Date.now(),
        //     sender: user.id,
        //     receiver: sellerId,
        //     text: input ,
        //     createdAt: new Date()
        // };


        socket.emit("sendMessage", {

            senderId: user.id,
            receiverId: sellerId,
            text: input

        });

        // setMessages((prev) => [...prev,newMsg])
        // setMessages((prev) => [...prev, tempMessage])

        setInput("");

    };

    const markMessagesAsRead = async() => {
        try{
            await API.put(
                `/messages/read/${sellerId}/${user.id}`
            ) 
        } catch(err) {
              console.log(err)  
        }
    }

    return (

        <div className="chat-container">

            <div className="chat-header">

                <button 
                    className="back-btn"
                    onClick={() => navigate(-1)}
                >
                     ◀
                </button>

                <img 
                    src={
                        seller?.image
                        ? seller.image 
                        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(seller?.name || "User")
                    }
                    alt="" 
                />

                <div>
                    <h3> {seller?.name} </h3>
                    <small>Online</small>
                </div>
            </div>

            <div className="chat-messages">
                {
                    messages.map((msg) => (
                        <div
                            key={msg._id }
                            className={
                                String(msg.sender) === String(user.id)
                                ? "message-wrapper mine"
                                : "message-wrapper other"
                            }
                        >

                            <div className="message-bubble">
                                <p>{msg.text}</p>

                                <span className="msg-time">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>

                        </div>
                    ))
                }

                <div ref={bottomRef}></div>

            </div>

            <div className="chat-input-area">

                <input 
                    type="text"
                    placeholder="Type a message..." 
                    value={input}
                    onChange={(e) => 
                        setInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            sendMessage();
                        }
                    }}
                />

                <button onClick={sendMessage}>
                         ➤
                </button>

            </div>

        </div>

    );

}

export default Chat;

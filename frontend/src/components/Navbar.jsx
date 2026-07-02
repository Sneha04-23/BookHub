import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useEffect } from "react";
import API from "../services/api";


function Navbar() {

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [search, setSearch] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    
    // const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user"));
    
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);

    const isLoggedIn = !!token;

    useEffect(() => {
        if(token){
            fetchNotifications()
        }
        
    },[token])

    const handleSearch = () =>{
        const trimmedSearch = search.trim();

        if (!trimmedSearch) return;
            
        navigate(
            `/books?search=${encodeURIComponent(trimmedSearch)}`
        )

        setSearch("")
        
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            handleSearch()
        }
    };

    const handleNotificationClick = async () => {
        if(!isLoggedIn){
            navigate("/login")
            return;
        }
        navigate("/notification");

        try {
            await API.put("/orders/notification/read");
            setUnreadCount(0);
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        
        dispatch(logout())

        navigate("/login");

    }

    const handleProfile = () => {
        navigate ("/profile")
        
    }

    const fetchNotifications = async () => {
        try{
            const res = await API.get("/orders/notifications")
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch(err){
            console.log(err)
        }
    }
    // const user = JSON.parse(localStorage.getItem("user"))



    return(
        <nav className="navbar">

            <div className="logo">
                <h1>BookHub</h1>
            </div>

            <ul className="nav-links">
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() =>{
                    if (!isLoggedIn) {
                        navigate("/login");
                        return;
                    }

                    navigate("/books")}
                    }
                >Books</li>
                <li onClick={() =>{
                    if (!isLoggedIn) {
                        navigate("/login");
                        return;
                    }

                    navigate("/categories")
                }} 
                >Categories</li>
            </ul>

            <div className="nav-right">

                <div className="search-box">
                    <input 
                        type="text"
                        placeholder="Search books..."
                        
                        className="search-input"

                        value={search}
                        onChange={(e) => setSearch(e.target.value)}

                        onKeyDown={handleKeyDown}
                    />

                    <FiSearch className="search-icon" onClick={handleSearch} />

                </div>

                <div className="topbar-icon"  onClick={handleNotificationClick}>
                    <IoNotificationsOutline  />
                    {unreadCount >0 && (
                        <span>{unreadCount} </span>
                    )}

                </div>
                {
                    isLoggedIn ?(
                        <div className="profile-section"  onClick={() => setShowMenu(!showMenu)}>
                            <img 
                                src={user?.image
                                    ? user.image
                                    : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")
                                } 
                                alt={user?.name}
                                className="profile-pic" 
                                
                            />

                            <span className="profile-name" >
                                {user?.name?.split(" ")[0]}
                            </span>
                            {
                                showMenu&& (
                                    <div className="profile-dropdown">

                                        <p className="pro-log" onClick={handleProfile }> Profile </p>
                                        <button onClick={handleLogout}>Logout</button>

                                    </div>
                                )
                            }
                        </div>
                    ):(
                        <button 
                            className="login-btn" 
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar;
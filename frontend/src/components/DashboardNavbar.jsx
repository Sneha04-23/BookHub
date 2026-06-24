import "./DashboardNavbar.css"
import { FiSearch } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";


function DashboardNavbar(){

    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const { user } = useSelector(
        (state) => state.auth
    );

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

    return(

        <div className="dashboard-navbar">
            <div className="dashboard-logo" onClick={() => navigate("/")}>
                
                <h1>BookHub</h1>
                
            </div>

            <div className="dashboard-search">

                <input 
                    type="text" 
                    placeholder="Search books" id="" 
                    
                    value={search}
                        onChange={(e) => setSearch(e.target.value)}

                        onKeyDown={handleKeyDown}
                />
                
                <FiSearch className="dashboard-search-icon"  onClick={handleSearch} />

            </div>

            <div className="side-navbar">
                <div className="dashboard-right">
                    {/* <IoNotifications /> */}
                    <span> </span>

                </div>

                <div className="dashboard-profile" onClick={() => navigate("/profile")}>
                    <img src={user?.image
                            ? user.image
                            : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")
                        }    
                        alt={user.name} 
                    />

                </div>
            </div>

            

        </div>

    );
}

export default DashboardNavbar;

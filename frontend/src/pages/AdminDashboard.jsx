import "./AdminDashboard.css";
import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";

import API from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {


    const [stats, setStats] = useState({
        totalUser:0,
        totalBooks:0,
        totalOrders:0,
        soldBooks:0,
        totalExchanges:0,
        completedExchanges:0

    });

    const [recentUsers, setRecentUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard();
    },[]);

    const fetchDashboard = async () => {
        try{
            const res = await API.get("/admin/dashboard");
            setStats({
                totalUser: res.data.totalUser,
                totalBooks: res.data.totalBooks,
                totalOrders: res.data.totalOrders,
                soldBooks: res.data.soldBooks,
                totalExchanges: res.data.totalExchanges,
                completedExchanges:res.data.completedExchanges
            });

            setRecentUsers(res.data.recentUsers);

        } catch(err) {
            console.log(err);
        }
    };



  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar-admin">
        <div className="logo1">
          <h1>BookHub</h1>
          <p>Admin</p>
        </div>

        <ul className="menu1">

          <li className="active"> <FaHome /> Dashboard  </li>
          <li onClick={() => navigate("/admin/users")} > <FaUsers /> Users </li>
          <li onClick={() => navigate("/admin/books")}> <FaBook /> Books </li>
          <li onClick={() => navigate("/admin/orders")}> <FaShoppingCart />  Orders </li>
          <li onClick={() => navigate("/admin/exchanges")}> <FaExchangeAlt /> Exchanges </li>
          <li onClick={() => navigate("/admin/sold-books")}> <FaCheckCircle /> Sold Books </li>
          <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">

        <div className="dashboard-header1">
            <h1>Admin Dashboard</h1>
            <p>Manage users, books, orders and exchanges</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <h4>Total Users</h4>
            <h2>{stats.totalUser}</h2>
          </div>

          <div className="stat-card">
            <FaBook className="stat-icon" />
            <h4>Total Books</h4>
            <h2> {stats.totalBooks} </h2>
          </div>

          <div className="stat-card">
            <FaShoppingCart className="stat-icon" />
            <h4>Total Orders</h4>
            <h2>{stats.totalOrders}</h2>
          </div>

          <div className="stat-card">
            <FaBook className="stat-icon" />
            <h4>Sold Books</h4>
            <h2>{stats.soldBooks} </h2>
          </div>
          <div className="stat-card">
            <FaExchangeAlt className="stat-icon" />
            <h4>Total Exchanges</h4>
            <h2>{stats.totalExchanges} </h2>
          </div>
          <div className="stat-card">
            <FaCheckCircle className="stat-icon" />
            <h4>Completed Exchanges</h4>
            <h2>{stats.completedExchanges} </h2>
          </div>

        </div>

        <div className="summary-card">

          <h3>Platform Activity</h3>

          <div className="summary-stats">

              <div>
                  <span>{stats.totalOrders}</span>
                  <p>Orders</p>
              </div>

              <div>
                  <span>{stats.totalExchanges}</span>
                  <p>Exchanges</p>
              </div>

              <div>
                  <span>
                      {stats.soldBooks + stats.completedExchanges}
                  </span>
                  <p>Successful Transactions</p>
              </div>

          </div>

      </div>

        {/* Recent Users */}
        <div className="recent-users">

          <h3>Recent Users</h3>

          {
            recentUsers.map(user => (
                <div key={user._id}
                    className="user-row"
                >
                     <div className="user-left">

                        <img
                            src={
                                user.image
                                ?  user.image
                                : "https://i.pravatar.cc/40"
                            }
                            alt=""
                        />

                        <div>
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                        </div>

                    </div>

                    <span>
                        {new Date(
                            user.createdAt
                        ).toLocaleDateString()}
                    </span>

                </div>
            ))
          }

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
    import ConfirmModal from "../components/ConfirmModal";

import { FaHome,FaUsers, FaBook,  FaShoppingCart,
  FaExchangeAlt, FaCheckCircle, FaStepBackward } from "react-icons/fa";

import "./AdminUsers.css"


function AdminUsers() {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);


const [modalOpen, setModalOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await API.get("/admin/users");
        setUsers(res.data);
    };

    const deleteUser = async(id) => {

        if(window.confirm("Delete this user?")) {

            await API.delete(`/admin/users/${id}`);

            fetchUsers();
        }
    };

    const confirmDelete = async () => {
        await API.delete(`/admin/users/${selectedUser}`);
        setModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
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
            
                      <li onClick={() => navigate("/admin")}> <FaHome /> Dashboard  </li>
                      <li className="active"  > <FaUsers /> Users </li>
                      <li onClick={() => navigate("/admin/books")}> <FaBook /> Books </li>
                      <li onClick={() => navigate("/admin/orders")}> <FaShoppingCart />  Orders </li>
                      <li onClick={() => navigate("/admin/exchanges")}> <FaExchangeAlt /> Exchanges </li>
                      <li onClick={() => navigate("/admin/sold-books")}> <FaCheckCircle /> Sold Books </li>
                      <li className="back-profile" onClick={() => navigate("/profile")}> <FaStepBackward /> Back </li> 
                    </ul>
                  </div>
            
                  {/* Main Content */}
            <div className="main-content1">
                <h2 className="page-title">Users</h2>
                <div className="users-grid-ad">

                    {users.map(user => (

                        <div className="user-card-ad" key={user._id}>
                            <div className="user-info-ad">
                                <h4>{user.name}</h4>
                                <p>{user.email}</p>
                            </div>
                            
                            <span className={`role ${user.role}`} >{user.role} </span>

                            <button
                                className="delete-btn"
                                onClick={() =>{
                                    setSelectedUser(user._id);
                                    setModalOpen(true);
                                }}
                            >
                                Delete
                            </button>

                        </div>

                    ))}  
                </div>
                
                    
            </div>
                        <ConfirmModal
                            open={modalOpen}
                            title="Delete User"
                            message="Are you sure you want to delete this user?"
                            onCancel={() => setModalOpen(false)}
                            onConfirm={confirmDelete}
                        />
           

        </div>
    );
}

export default AdminUsers;
import CustomModal from "../components/CustomModal";
import "./Login.css";
import API from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

import loginImage from "../assets/book1.png"

function Login(){

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [showModal,setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")

    const [email, setEmail] = useState("");
    const [password, setPassword]  = useState("");

    const handleLogin = async() => {
        try{

            const res = await API.post("/users/login", {
                email,
                password 
            });

    

            dispatch(loginSuccess({
                user:res.data.user,
                token: res.data.token
            }))

            setModalMessage("Login Successful ");
            setShowModal(true);

            setTimeout(() => {
                navigate("/")
            }, 1500);
            

        } catch(err) {
            console.log(err);

            setModalMessage(
                err.response?.data?.message ||
                "Login failed"
            );
            setShowModal(true);
        }
    }



    return (

        <div className="login-page">
            {/* <h1>Login Page</h1> */}
            {/* --------------left-side-------------------------------------------- */}

            <div className="login-left">
                <h1>Welcome Back!</h1>

                <p>Login to continue buying, selling and exchanging your books.</p>

                <img 
                    src={loginImage}
                    alt="books"
                    className="login-image" 
                />

            </div>

{/* ---------------------------Right-side-------------------------------------------------------------- */}

            <div className="login-right">

                <div className="login-card">
                    <h2>Login to BookHub</h2>

                    <p className="login-subtext">
                        Don't have an account?
                        <span onClick={() => navigate("/signup")}>
                            Signup
                        </span>
                    </p>

                    <div className="input-group">
                        <label htmlFor="">Email Address</label>
                        <input 
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                   
                    <div className="input-group">
                        <label htmlFor="">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleLogin}>
                        Login
                    </button>

                    

                </div>

            </div>

            {
                showModal && (
                    <CustomModal
                        message={modalMessage}
                        onClose={() => {
                            setShowModal(false);

                            // if(modalMessage.includes("Successfully")){
                            //     navigate("/");
                            // }
                        }}
                    />
                )
            }

        </div>
    )
}

export default Login;


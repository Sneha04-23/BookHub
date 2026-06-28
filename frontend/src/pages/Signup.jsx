import CustomModal from "../components/CustomModal";
import "./Signup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import signupImage from "../assets/book1.png";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

function Signup(){

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const [showModal,setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {

        try{

            const res = await API.post(
                "/users/signup",
                {
                    name,
                    email,
                    password
                }
            );

            console.log(res.data);

            dispatch(
                loginSuccess({
                    token: res.data.token,
                    user:res.data.user 
                })
            );

            setModalMessage("Account Created Successfully");
            setShowModal(true)



        } catch(err){

            console.log(err);

            setModalMessage(
                err.response?.data?.message ||
                "Signup Failed"
            );
            setShowModal(true);

        }

    };

    return(

        <div className="signup-page">

            {/* LEFT */}

            <div className="signup-left">

                <h1>Join BookHub </h1>

                <p>
                    Create your account and start buying,
                    selling and exchanging books with readers.
                </p>

                <img
                    src={signupImage}
                    alt="books"
                    className="signup-image"
                />

            </div>

            {/* RIGHT */}

            <div className="signup-right">

                <div className="signup-card">

                    <h2>Sign Up</h2>

                    <p className="signup-subtext">
                        Already have an account?
                        <span onClick={() => navigate("/login")}>
                            Login
                        </span>
                    </p>

                    <div className="input-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="input-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    <button onClick={handleSignup}>
                        Create Account
                    </button>

                </div>

            </div>

            {
                showModal && (
                    <CustomModal
                        message={modalMessage}
                        onClose={() => {
                            setShowModal(false);

                            if(modalMessage.includes("Successfully")){
                                navigate("/");
                            }
                        }}
                    />
                )
            }

        </div>

    );
}

export default Signup;
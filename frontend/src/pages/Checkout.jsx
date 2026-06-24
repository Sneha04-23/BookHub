import "./Checkout.css";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



import API from "../services/api";
import CustomModal from "../components/CustomModal";
import config from "../config/config";

function Checkout() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [book, setBook] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [modalMessage, setModalMessage] = useState("");

    const [formData, setFormData] = useState({

        address: "",
        city: "",
        pincode: "",
        phone: "",
        paymentMethod: "COD"

    });

    useEffect(() => {

        fetchBook();

    }, []);

    const fetchBook = async () => {

        try {

            const res = await API.get(`/books/${id}`);

            setBook(res.data);

        } catch(err) {

            console.log(err);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    // console.log("KEY = " ,config.VITE_RAZORPAY_KEY)
    // console.log(import.meta.env)
    // console.log(import.meta.env.VITE_RAZORPAY_KEY_ID)

    const handleOrder = async () => {

        try {

            if(
                !formData.address ||
                !formData.city ||
                !formData.pincode ||
                !formData.phone
            ){
                setModalMessage("Please fill all fields");
                setShowModal(true);
                return;
            }

            if(formData.paymentMethod === "UPI"){

                const { data } = await API.post(
                    "/payment/create-order",
                    {amount: book.price}
                );

            
                const options = {
                    key: config.VITE_RAZORPAY_KEY,
                    amount: data.amount,
                    currency: data.currency,
                    name: "BookStore",
                    description: book.title,
                    order_id: data.id,
                    handler: async function(response) {
                        await API.post(

                            `/orders/buy/${id}`,

                            {
                                ...formData,
                                paymentId:
                                response.razorpay_payment_id 
                            }

                        );
                        
                        setModalMessage(
                            "Payment Successful"
                        )

                        setShowModal(true);

                        setTimeout(() => {
                            navigate("/profile");
                        }, 1500);

                    },

                    modal: {
                        ondismiss: function () {
                            setModalMessage("Payment Cancelled");
                            setShowModal(true);
                        }
                    },

                    theme: {
                        color: "#6bcf63"
                    }
                };

                const razor = new window.Razorpay(options);
                razor.open();
            }
            else{
                await API.post(
                    `/orders/buy/${id}`,
                    formData
                );

                setModalMessage("Order Placed Successfully");

                setShowModal(true);

                setTimeout(() => {
                    navigate(-1)
                }, 1200);
            }

            
        } catch(err) {

            console.log(err);

            setModalMessage(

                err.response?.data?.message ||
                "Failed to place order"

            );

            setShowModal(true);

        }

    };

    if(!book) {

        return <h2>Loading...</h2>

    }

    return (

        <div className="checkout-page">

            <div className="checkout-card">
                <div className="title">
                    <p className="backbtn" onClick={()=>navigate(-1)}> ◀ </p>
                    <h1>Checkout</h1>
                </div>
                

                <div className="checkout-book">

                    <img
                        src={ book.image }
                        alt=""
                    />

                    <div>

                        <h2>{book.title}</h2>

                        <p>{book.author}</p>

                        <h3>₹{book.price}</h3>

                    </div>

                </div>

                <div className="checkout-section">

                    <h3>Shipping Details</h3>

                    <input
                        type="text"
                        name="address"
                        placeholder="Enter Address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <div className="checkout-row">

                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                        />

                    </div>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                </div>

                <div className="checkout-section">

                    <h3>Payment Method</h3>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >

                        <option value="COD">
                            Cash On Delivery
                        </option>

                        <option value="UPI">
                            UPI
                        </option>

                    </select>

                </div>

                <div className="checkout-btns">

                    <button
                        className="confirm-btn"
                        onClick={handleOrder}
                    >
                        Place Order
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                </div>

            </div>

            {
                showModal && (

                    <CustomModal
                        message={modalMessage}
                        onClose={() =>
                            setShowModal(false)
                        }
                    />

                )
            }

        </div>

    );
}

export default Checkout;


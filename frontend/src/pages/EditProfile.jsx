import "./EditProfile.css";
import CustomModal from "../components/CustomModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";

import API from "../services/api";

function EditProfile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [showModal,setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")

    const { user } = useSelector(
        (state) => state.auth
    );

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [location, setLocation] = useState(user?.location || "");
    const [image, setImage] = useState(null);

    const handleSubmit = async(e) => {

        e.preventDefault();

        try{

            const formData = new FormData();

            formData.append("name", name);
            formData.append("bio", bio);
            formData.append("location", location);

            if(image){
                formData.append("image", image);
            }

            const res = await API.put(
                "/users/profile",
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );
            
            dispatch(updateUser(res.data));

            setModalMessage("Profile Updated Successfully");
            setShowModal(true)

            setTimeout(() => {
                navigate("/profile");
            }, 1500);
            

        } catch(err){
            console.log(err);

            setModalMessage(
                err.response?.data?.message ||
                "Failed to update profile"
            );
            setShowModal(true)

            setTimeout(() => {
                navigate("/profile");
            }, 1500);

            
        }
    };

    return(

        <div className="edit-profile-page">

            <form
                className="edit-profile-form"
                onSubmit={handleSubmit}
            >

                <h1>Edit Profile</h1>

                <div className="profile-preview">

                    <img
                        src={
                            image
                            ? URL.createObjectURL(image)
                            : user.image
                            ? user.image
                            : "https://i.pravatar.cc/150"
                        }
                        alt=""
                    />

                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImage(e.target.files[0])
                    }
                />

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) =>
                        setLocation(e.target.value)
                    }
                />

                <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) =>
                        setBio(e.target.value)
                    }
                />
                <div className="button-pro">
                    <button className="submit-btn" type="submit">
                        Save Changes
                    </button>
                    <button className="cancel-btn" onClick={() => navigate("/profile")}>
                        Cancel
                    </button>

                </div>
                
            </form>

            {
                showModal && (
                    <CustomModal
                        message={modalMessage}
                        onClose={() => setShowModal(false)}
                    />
                )
            }

        </div>
    );
}

export default EditProfile;


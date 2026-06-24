import CustomModal from "../components/CustomModal";
import "./AddBook.css";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";

function AddBook(){

    const navigate = useNavigate();

    const [showModal,setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("")

    const [ loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [mrp, setMrp] = useState("");
    const [condition, setCondition] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [publishedYear, setPublishedYear] = useState("");
    const [language, setLanguage] = useState("");
    const [pages, setPages] = useState("");

    const [preview, setPreview] = useState(null)
    const [suggestedPrice, setSuggestedPrice] = useState(0)

    const handleSuggestion = () => {

        if(!mrp || !condition){
            setModalMessage("Enter MRP and select condition");
            setShowModal(true)
            return;
        }

        let percentage = 0;

        switch(condition){

            case "New":
                percentage = 0.9;
                break;

            case "Like New":
                percentage = 0.8;
                break;

            case "Good":
                percentage = 0.65;
                break;

            case "Acceptable":
                percentage = 0.45;
                break;

            default:
                percentage = 0.5;
        }

        const suggested = Math.floor(mrp * percentage);

        setSuggestedPrice(suggested);

        // auto fill price
        setPrice(suggested);
    };

    const handleAddBook = async (e) => {

    e.preventDefault();

    if (loading) return
    setLoading(true)

    try{

        const formData = new FormData();

        formData.append("title", title);
        formData.append("author", author);
        formData.append("price", price);
        formData.append("mrp", mrp);
        formData.append("condition", condition);
        formData.append("category", category);
        formData.append("description", description);

        formData.append("language", language);
        formData.append("pages",pages);
        formData.append("publishedYear", publishedYear)

        formData.append("image", image);

        const token = localStorage.getItem("token");

        const res = await API.post(
                "/books/add",
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(res.data);

            setModalMessage("Book Added Successfully");
            setShowModal(true)

            setTimeout(() => {
                navigate("/books");
            }, 1500);
            

        } catch(err){

            console.log(err);

            setModalMessage(
                err.response?.data?.message ||
                "Failed to add book"
            );
            setShowModal(true)

        } finally {
            setLoading(false)
        }

    };

    return(

        <div className="addbook-page">

            <div className="addbook-container">

                <h1>Add New Book</h1>

                <form className="addbook-form"  onSubmit={handleAddBook}>

                    <div className="form-row">

                        <div className="form-group">
                            <label >Title</label>

                            <input 
                                type="text" 
                                placeholder="Enter book title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                        </div>

                        <div className="form-group">
                            <label >Author</label>

                            <input 
                                type="text" 
                                placeholder="Enter author title"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />

                        </div>

                    </div>

                    

                    <div className="form-row">

                        <div className="form-group">

                            <label htmlFor="">Condition</label>

                            <select 
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                <option value="">
                                    Select Condition
                                </option>

                                <option value="New">
                                    New
                                </option>

                                <option value="Like New">
                                    Like New
                                </option>

                                <option value="Good">
                                    Good
                                </option>

                                <option value="Acceptable">
                                    Acceptable
                                </option>
                                
                            </select>
                        </div>

                        <div className="form-group">

                            <label>Category</label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Fiction">
                                    Fiction
                                </option>

                                <option value="Non-Fiction">
                                    Non-Fiction
                                </option>
                                
                                <option value="Romance">
                                    Romance
                                </option>

                                <option value="Fantasy">
                                    Fantasy
                                </option>

                                <option value="Science Fiction">
                                    Science Fiction
                                </option>

                                <option value="Technology">
                                    Technology
                                </option>

                                <option value="Mystery & Thriller">
                                    Mystery & Thriller
                                </option>

                                <option value="Historical Fiction">
                                    Historical Fiction
                                </option>

                                <option value="Biography">
                                    Biography
                                </option>

                                <option value="Self Help">
                                    Self Help
                                </option>

                                <option value="Business">
                                    Business
                                </option>

                                <option value="Finance">
                                    Finance
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="Academic">
                                    Academic
                                </option>

                                <option value="Comics">
                                    Comics
                                </option>

                                <option value="Children">
                                    Children
                                </option>

                                <option value="Poetry">
                                    Poetry
                                </option>

                                <option value="Philosophy">
                                    Philosophy
                                </option>

                                <option value="Religion">
                                    Religion
                                </option>

                                <option value="Medical">
                                    Medical
                                </option>

                                <option value="Engineering">
                                    Engineering
                                </option>

                                <option value="Entrance Exam">
                                    Entrance Exam
                                </option>

                            </select>

                        </div>

                    </div>
                    <div className="price-row">

                        <div className="form-group">
                            <label htmlFor="">MRP (₹) </label>

                            <input
                                type="number"
                                placeholder="Enter MRP"
                                value={mrp}
                                onChange={(e) => setMrp(e.target.value) } 
                            />
                        </div>

                        <div className="form-group">
                            <label >Your Price (₹) </label>

                            <input
                                type="number"
                                placeholder="Enter Selling price"
                                value={price}
                                onChange={(e) => {
                                    const enteredPrice = Number(e.target.value);

                                    if(enteredPrice > suggestedPrice) {
                                        setModalMessage(
                                            `Price cannot be more than ₹${suggestedPrice}`
                                        );
                                        setShowModal(true)
                                        return;
                                    }

                                    setPrice(enteredPrice);
                                }} 
                            />
                        </div>

                        <button
                            type="button"
                            className="suggest-btn"
                            onClick={handleSuggestion}
                        >
                            Get Suggestion
                        </button>

                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="">Description</label>

                        <textarea 
                            placeholder = "Description the book..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="other-row">

                        <div className="form-group">
                            <label htmlFor=""> Language </label>

                            <input
                                type="string"
                                placeholder="Language of the Book "
                                value={language}
                                onChange={(e) => setLanguage(e.target.value) } 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor=""> Pages </label>

                            <input
                                type= "number"
                                placeholder="Total Pages"
                                value={pages}
                                onChange={(e) => setPages(e.target.value) } 
                            />
                        </div>

                        <div className="form-group">
                            <label >Published Year</label>

                            <input
                                type="number"
                                placeholder="Enter the Published Year"
                                value={publishedYear}
                                onChange={(e) => setPublishedYear(e.target.value)
                                } 
                            />
                        </div>

                        

                    </div>
                    <div className="form-group">
                        <label htmlFor="">Book Image</label>

                        <label className="upload-box">
                            {
                                preview ? (
                                    <img src={preview} alt="Preview" className="preview-image" />
                                ):(
                                    <>
                                        <FiUpload className="upload-icon" />
                                        <p>Upload Image</p>

                                    </>
                                    )
                            }

                                <input 
                                    type="file" 
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                            setImage(file);

                                        if(file){
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                
                        </label>

                    </div>

                    {/* Buttons */}

                    <div className="button-group">

                        <button 
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading? "Uploading..":"Post Book"}
                        </button>

                    </div>

                </form>

            </div>

            {
                showModal && (
                    <CustomModal
                        message={modalMessage}
                        onClose={() => {
                            setShowModal(false);
                        }}
                    />
                )
            }

        </div>

    );
}

export default AddBook;
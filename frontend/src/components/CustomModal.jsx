import "./CustomModal.css";

function CustomModal ({ message, onClose}) {
    return(
        <div className="modal-overlay"> 
            <div className="modal-box">
                <h2>BookHub</h2>
                <p> {message} </p>

                <button onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    )
}

export default CustomModal;
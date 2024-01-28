import React, { useState } from "react";
import "./Modal.css";

export default function Modal(){
    
    const [modal, setModal] = useState(false);

    const toggleModal = () =>{
        setModal(!modal)
    }

    return(
        <div>
            <button className="btn-modal" onClick={toggleModal}>Nút</button>

            {modal && (
                <div className="modal">
                    <div className="overlay" onClick={toggleModal}></div>
                    <div className="modal-content">
                        <h2>Hello mtf</h2>
                        <p>
                        Lorem ipsum dolor, sit amet consectetur adip
                        isicing elit. Nihil asperiores itaque quis reprehenderit 
                        voluptates nesciunt cum repellendus facere iure dolorem.
                        </p>
                        <button className="close-modal" onClick={toggleModal}></button>
                    </div>
                </div>
            )}
        </div>
    )
}
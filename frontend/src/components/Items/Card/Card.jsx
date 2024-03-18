import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarImage from "../../../images/Hyundai-accent-2022.jpg"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import axios from "axios";
import "./Card.css"

// export default function Card({ itemId, shape, material, image, title, price, discount })
export default function Card({id, image, name, price, ldescription, rating}) {

    const navigate = useNavigate()
    // const [carName, setCarName] = useState([])

    // async function getCarName(){
    //     try {
    //         const reponse = await axios.get(`http://localhost:4000/car/type/${typeId}`)
    //         setCarName(reponse.data)
    //     } catch (error) {
    //         console.error('Error fetching data:'+ error)
    //     }
    // }

    useEffect(() => {
        // getCarName()
    },[])
    
    return (
        <div id="item" onClick={()=>navigate(`/car/cardetail/${id}`)}>
            <div className="container">
                <div className="img-container">
                    <img className="img" src={image}  loading="lazy"/>
                </div>
                <div className="item-detail">
                    <div className="item-amenities">

                    </div>
                    <div className="title">{name}</div>
                    <div className="location" style={{fontSize: "20"}}><LocationOnIcon/>{ldescription}</div>
                    <hr/>
                    <div className="price-info">
                        <div className="rating" style={{color: "rgb(255, 225, 0)", fontWeight: "450"}}><StarRoundedIcon style={{color: "rgb(255, 225, 0)", height: "24px"}}/>{rating ? rating : ''}</div>
                        <div className="price" style={{display: "flex", color: "green",fontSize: "0.9em", fontWeight: "500", alignItems: "center"}}>{price}K<p style={{color: "#4F4F4F", fontSize: "0.8em", padding: "0"}}>/ngày</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarImage from "../../../images/Hyundai-accent-2022.jpg"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import axios from "axios";
import "./Card.css"

// export default function Card({ itemId, shape, material, image, title, price, discount })
export default function Card({id, image, year, price, description, typeId}) {

    const navigate = useNavigate()
    const [carName, setCarName] = useState([])

    async function getCarName(){
        try {
            const reponse = await axios.get(`http://localhost:4000/car/type/${typeId}`)
            setCarName(reponse.data)
        } catch (error) {
            console.error('Error fetching data:'+ error)
        }
    }

    useEffect(() => {
        getCarName()
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
                    <div className="title">{carName.name} {year}</div>
                    <div className="location"><LocationOnIcon/> Quận 7, Hồ Chí Minh</div>
                    <hr/>
                    <div className="price-info">
                        <div className="rating" style={{color: "rgb(255, 225, 0)", fontWeight: "450"}}><StarRoundedIcon style={{color: "rgb(255, 225, 0)", height: "24px"}}/>5</div>
                        <div className="price" style={{color: "green", fontWeight: "500"}}>{price}K</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
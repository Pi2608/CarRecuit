import React from "react";
import { useNavigate } from "react-router-dom";
import CarImage from "../../../images/Hyundai-accent-2022.jpg"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import "./Card.css"

// export default function Card({ itemId, shape, material, image, title, price, discount })
export default function Card({id, ownerId, carTypeId, image, discount, price}) {

    const navigate = useNavigate()

    return (
        <div id="item" onClick={()=>navigate("/cardetail")}>
            <div className="container">
                <img className="img" src={CarImage} />
                <div className="item-detail">
                    <div className="item-amenities">

                    </div>
                    <div className="title">{carTypeId} 2022</div>
                    <div className="location"><LocationOnIcon/> Quận 7, Hồ Chí Minh</div>
                    <hr/>
                    <div className="price-info">
                        <div className="rating"><StarRoundedIcon style={{color: "rgb(255, 225, 0)", height: "24px"}}/>5</div>
                        <div className="price">850K</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
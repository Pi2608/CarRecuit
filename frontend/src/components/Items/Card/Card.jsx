import React from "react";
import "./Card.css"

// export default function Card({ itemId, shape, material, image, title, price, discount })
export default function Card() {
    return (
        <div id="item">
            <img className="img"/>
            <div className="item-detail">
                <div className="item-amenities">

                </div>
                <div className="title"></div>
                <div className="location"></div>
                <hr/>
                <div className="price-info">
                    <div className="rating"></div>
                    <div className="price"></div>
                </div>
            </div>
        </div>
    )
}
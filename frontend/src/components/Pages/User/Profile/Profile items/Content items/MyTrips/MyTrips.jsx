import React from "react";
import "./MyTrips.css"

export default function MyTrips(){
    return (
        <div id="mytrip">
            <div className="container">
                <h1>Chuyến của tôi</h1>
                <div className="trip-container">
                    <div>Bạn chưa có chuyến</div>
                </div>
            </div>
        </div>
    )
}
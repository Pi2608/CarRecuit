import React,{ useState, useEffect } from "react";
import axios from "axios";
import "./MyTrips.css"

export default function MyTrips(){

    const [togglePart, setTogglePart] = useState(true);

    const [currentList, setCurrentList] = useState([]);
    const [historyList, setHistoryList] = useState([]);

    async function getTrip(){
        try {
            const response = await axios.get(``);
        } catch (error) {
            
        }
    }

    return (
        <div id="mytrip">
            <div className="container">
                <div className="container-header">
                    <h1>Chuyến của tôi</h1>
                </div>
                <div className="container-body">
                <div className="toggle-part">
                    <div className={`choice ${togglePart ? 'active' : ''}`} onClick={() => setTogglePart(true)}>
                        <p>Chuyến hiện tại</p>
                    </div>
                    <div className={`choice ${!togglePart ? 'active' : ''}`} onClick={() => setTogglePart(false)}>
                        <p>Lịch sử chuyến</p>
                    </div>
                </div>

                    <div className="trip-container">
                        <div>Bạn chưa có chuyến</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
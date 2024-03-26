import React,{ useState, useEffect } from "react";
import { useAuth } from "../../../../../../../Context/AuthProvider";
import axios from "axios";
import "./MyTrips.css"

export default function MyTrips(){

    const { auth, id } = useAuth()

    const [togglePart, setTogglePart] = useState(true);

    const [currentList, setCurrentList] = useState([]);
    const [historyList, setHistoryList] = useState([]);

    async function getHistoryTrip() {
        try {
            const response = await axios.get(`http://localhost:4000/rent/historyTrip/${id}`);
            const data = response.data;
    
            const historyListWithImagesPromise = data.map(async (historyTrip) => {
                try {
                    const imageUrlPromise = new Promise((resolve) => {
                        const img = new Image();
                        img.src = historyTrip.imgUrl; // Assuming the user image URL is stored in a property named 'imgUrl'
                        img.onload = () => resolve(img.src);
                        img.onerror = () => resolve(null);
                    });
    
                    const imageUrl = await imageUrlPromise;
    
                    return {
                        ...historyTrip,
                        userImageUrl: imageUrl
                    };
                } catch (error) {
                    console.error('Error fetching user image URL:', error);
                    return null;
                }
            });
    
            const historyListWithImages = await Promise.all(historyListWithImagesPromise);
            setHistoryList(historyListWithImages.filter(history => history !== null));
        } catch (error) {
            console.error("Error fetching history list" + error);
        }
    }

    async function getCurrentTrip() {
        try {
            const response = await axios.get(`http://localhost:4000/rent/currentTrip/${id}`);
            const data = response.data;
    
            const currentListWithImagesPromise = data.map(async (currentTrip) => {
                try {
                    const imageUrlPromise = new Promise((resolve) => {
                        const img = new Image();
                        img.src = currentTrip.imgUrl; // Assuming the user image URL is stored in a property named 'imgUrl'
                        img.onload = () => resolve(img.src);
                        img.onerror = () => resolve(null);
                    });
    
                    const imageUrl = await imageUrlPromise;
    
                    return {
                        ...currentTrip,
                        userImageUrl: imageUrl
                    };
                } catch (error) {
                    console.error('Error fetching user image URL:', error);
                    return null;
                }
            });
    
            const currentListWithImages = await Promise.all(currentListWithImagesPromise);
            setCurrentList(currentListWithImages.filter(current => current !== null));
        } catch (error) {
            console.error("Error fetching current list" + error);
        }
    }

    useEffect(()=>{
        async function getData(){
            await getCurrentTrip();
            await getHistoryTrip();
        }
        getData();
    },[])

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
                        {togglePart ? 
                            currentList.length > 0 ? 
                                <table style={{width: "100%"}}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tên xe</th>
                                            <th>Ngày nhận - Ngày trả</th>
                                            <th>Chủ xe</th>
                                            <th>Giá</th>
                                            <th>Trạng thái</th>
                                            <th>Được chấp nhận</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentList.map((currentTrip) => (
                                            <tr key={currentTrip.tripId}>
                                                <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                                                    <div className="img-container" style={{height: "120px", width: "120px", display: "flex", justifyContent: "center", borderRadius: "25px", overflow: "hidden"}}>
                                                        <img src={currentTrip.imgUrl} style={{ height: "100%", width: "auto", borderRadius: "10px"}}></img>
                                                    </div>
                                                </td>
                                                <td>{currentTrip.carName}</td>
                                                <td>{`${new Date(currentTrip.pick_up).toLocaleDateString()} - ${new Date(currentTrip.drop_off).toLocaleDateString()}`}</td>
                                                <td>{currentTrip.owner}</td>
                                                <td>{currentTrip.total}</td>
                                                <td>{currentTrip.status}</td>
                                                <td>{currentTrip.isAccepted ? 'Được' : 'Không'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                : 
                                <div>Bạn chưa có chuyến hiện tại</div>
                            : 
                            historyList.length > 0 ? 
                                <table style={{width: "100%"}}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Tên xe</th>
                                            <th>Ngày nhận - Ngày trả</th>
                                            <th>Chủ xe</th>
                                            <th>Giá</th>
                                            <th>Trạng thái</th>
                                            <th>Được chấp nhận</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyList.map((historyTrip) => (
                                            <tr key={historyTrip.tripId}>
                                                <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                                                    <div className="img-container" style={{height: "120px", width: "120px", display: "flex", justifyContent: "center", borderRadius: "25px", overflow: "hidden"}}>
                                                        <img src={historyTrip.imgUrl} style={{ height: "100%", width: "auto", borderRadius: "10px"}}></img>
                                                    </div>
                                                </td>
                                                <td>{historyTrip.carName}</td>
                                                <td>{`${new Date(historyTrip.pick_up).toLocaleDateString()} - ${new Date(historyTrip.drop_off).toLocaleDateString()}`}</td>
                                                <td>{historyTrip.owner}</td>
                                                <td>{historyTrip.total}</td>
                                                <td>{historyTrip.status}</td>
                                                <td>{historyTrip.isAccepted ? 'Được' : 'Không'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                : 
                                <div>Bạn chưa có chuyến nào</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
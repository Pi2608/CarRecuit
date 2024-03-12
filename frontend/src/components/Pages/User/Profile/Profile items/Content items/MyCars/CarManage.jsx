import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup'
import axios from 'axios';
import { useAuth } from '../../../../../../../Context/AuthProvider';
import "./CarManage.css"

export default function CarManage(){

    const { auth, id } = useAuth();
    
    const navigate = useNavigate();

    const [carList, setCarList] = useState([]);

    async function getCarList(){
        try {
            const response = await axios.get(`http://localhost:4000/car/owner/${id}`);
            const carListData = response.data;

            const carDataPromises = carListData.map(async (car) => {
                try {
                    // Fetch additional data for each car using the carId
                    const additionalDataResponse = await axios.get(`http://localhost:4000/rent/counting/${car.id}`);
                    const additionalData = additionalDataResponse.data;

                    // Fetch image
                    const imagePromise = new Promise((resolve) => {
                        const img = new Image();
                        img.src = car.imgUrl;
                        img.onload = () => resolve({ ...car, additionalData, loaded: true });
                        img.onerror = () => resolve({ ...car, additionalData, loaded: false });
                    });

                    return imagePromise;
                } catch (additionalDataError) {
                    console.error(`Error fetching additional data for car ${car.id}: ${additionalDataError.message}`);
                    return { ...car, additionalData: null, loaded: false };
                }
            });

            const loadedCarList = await Promise.all(carDataPromises);
            setCarList(loadedCarList);
        } catch (error) {
            console.error("Error fetching car :"+ error.message);
        }
    }

    useEffect(() => {
        if (!auth) {
            window.alert("Phiên đăng nhập của bạn đã hết. Vui lòng đăng nhập lại.");
            navigate("/");
         } else if (id) {
            getCarList();
         }
      }, [auth, id]);

    return(
        <div id="carmanage">
            <div className="container">
                <div className="head">
                    <h1>Danh sách xe</h1>
                    <div className="rgt-btn" onClick={()=>navigate("/car/carregister")}><AddIcon />Đăng ký xe</div>
                </div>
                <div className="car-list">
                    <table style={{width: "100%"}}>
                        <th className='tbl' style={{width: "140px"}}>Ảnh</th>
                        <th className='tbl'>Hãng và loại xe</th>
                        <th className='tbl'>Số chỗ</th>
                        <th className='tbl'>Giá</th>
                        <th className='tbl'>Số chuyến</th>
                        <th className='tbl'>Trạng thái</th>

                        {carList ? 
                        carList.map((car)=>
                        <tr key={car.id}>
                            <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                            <div className="img-container">
                                <img src={car.imgUrl} style={{backgroundColor: "red", height: "100%", width: "auto", borderRadius: "10px     "}}></img>
                            </div>
                            </td>
                            <td className='tbl'>{car.name}</td>
                            <td className='tbl'>{car.seats}</td>
                            <td className='tbl'>{car.price}K</td>
                            <td className='tbl'>{car.additionalData}</td>
                            <td className='tbl'>{car.status ? "Đang hoạt động": "Ngưng hoạt động"}</td>
                        </tr>)
                        :
                        <p>Bạn không có xe nào</p>
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}
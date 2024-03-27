import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../../../../Context/AuthProvider';
import "./UpComingRequest.css"

export default function UpComingRequest(){

    const { auth, id } = useAuth();
    
    const navigate = useNavigate();

    const [carRequest, setCarRequest] = useState([]);

    async function getCarRequest(){
        try {
            const response = await axios.get(`http://localhost:4000/rent/owner/upcoming/${id}`);
            const carListData = response.data;

            const imagePromises = carListData.map((car) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = car.imgUrl;
                    img.onload = () => resolve({ ...car, loaded: true });
                });
            });

            // Wait for all images to be loaded before updating state
            const loadedCarList = await Promise.all(imagePromises);
            setCarRequest(loadedCarList);
            return loadedCarList
        } catch (error) {
            console.error("Error fetching car :"+ error.message);
        }
    }

    function handleDateTime(d) {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDateTime;
    }

    useEffect(() => {
        async function fetchData(){
            await getCarRequest();
        }
        if (auth) {
            fetchData();
        }
    }, [auth]);
    
    useEffect(() => {},[id])

    return(
        <div id="carmanage-upcoming">
            <div className="container">
                <div className="head" onClick={() => console.log(carRequest.additionalData)}>
                    <h1>Danh sách xe</h1>
                </div>
                <div className="car-list">
                    <table style={{width: "100%"}}>
                        <th></th>
                        <th className='tbl' style={{width: "140px"}}>Ảnh</th>
                        <th className='tbl'>Hãng và loại xe</th>
                        <th className='tbl'>Tên khách thuê</th>
                        <th className='tbl'>Ngày nhận xe</th>
                        <th className='tbl'>Ngày trả xe</th>
                        <th className='tbl'>Trạng thái</th>

                        {carRequest ? 
                            carRequest.map((car)=>
                                <tr key={car.id}>
                                    <td style={{
                                        width: "0.2em", 
                                        backgroundColor:    car.status === null ? "orange" :
                                                            car.status === "Đang sử dụng" ? "#5fcf86" :
                                                            car.status === "Đã hoàn thành" ? "#5fcf86" : "initial"}} ></td>
                                    <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                                        <div className="img-container">
                                            <img src={car.imgUrl} style={{height: "100%", width: "auto", borderRadius: "10px"}}></img>
                                        </div>
                                    </td>
                                    <td className='tbl'>{car.carName}</td>
                                    <td className='tbl'>{car.name}</td>
                                    <td className='tbl'>{handleDateTime(car.pick_up)}</td>
                                    <td className='tbl'>{handleDateTime(car.drop_off)}</td>
                                    <td className='tbl'>{(car.status === null ? "Đang chờ" : car.status)}</td>
                                </tr>
                            )
                            :
                                <p>Bạn không có xe nào</p>
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}
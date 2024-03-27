import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../../../../Context/AuthProvider';
import "./PendingCarsList.css"

export default function PendingCarsList(){

    const { auth, id } = useAuth();
    
    const navigate = useNavigate();

    const [carRequest, setCarRequest] = useState([]);

    async function getCarRequest(){
        try {
            const response = await axios.get(`http://localhost:4000/rent/owner/request/${id}`);
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

    async function acceptRequest(rentDetailId){
        try {
            const request = await axios.get(`http://localhost:4000/rent/acceptRentDetail?rentDetailId=${rentDetailId}`)
            await getCarRequest();
        } catch (error) {
            
        }
    }

    async function declineRequest(rentDetailId){
        try {
            const request = await axios.get(`http://localhost:4000/rent/cancelByOwner?rentDetailId=${rentDetailId}`)
            await getCarRequest();
        } catch (error) {
            
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

    useEffect(() => {
        console.log(carRequest);
    },[carRequest])

    return(
        <div id="carmanage-request">
            <div className="container">
                <div className="head" onClick={() => console.log(carRequest.additionalData)}>
                    <h1>Danh sách xe</h1>
                </div>
                <div className="car-list">
                    <table style={{width: "100%"}}>
                        <th className='tbl' style={{width: "140px"}}>Ảnh</th>
                        <th className='tbl'>Hãng và loại xe</th>
                        <th className='tbl'>Tên khách thuê</th>
                        <th className='tbl'>Ngày nhận xe</th>
                        <th className='tbl'>Ngày trả xe</th>
                        <th className='tbl'>Nhận</th>
                        <th></th>
                        <th></th>

                        {carRequest ? 
                            carRequest.map((car)=>
                                <tr key={car.id}>
                                    <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                                        <div className="img-container">
                                            <img src={car.imgUrl} style={{height: "100%", width: "auto", borderRadius: "10px"}}></img>
                                        </div>
                                    </td>
                                    <td className='tbl'>{car.carName}</td>
                                    <td className='tbl'>{car.name}</td>
                                    <td className='tbl'>{handleDateTime(car.pick_up)}</td>
                                    <td className='tbl'>{handleDateTime(car.drop_off)}</td>
                                    <td className='tbl'>{car.received}K</td>
                                    <td>
                                        <div className="hdl-request-btn yes" onClick={()=>acceptRequest(car.id)}>
                                            Chấp nhận
                                        </div>
                                    </td>
                                    <td>
                                        <div className="hdl-request-btn no" onClick={()=>declineRequest(car.id)}>
                                            Từ chối
                                        </div>
                                    </td>
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
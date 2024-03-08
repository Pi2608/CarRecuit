import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import Card from "../../../Items/Card/Card";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import ElectricCarOutlinedIcon from '@mui/icons-material/ElectricCarOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TuneIcon from '@mui/icons-material/Tune';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MapIcon from '@mui/icons-material/Map';
import { GiGearStick } from "react-icons/gi";
import axios from "axios";
import "./CarList.css";

export default function CarList(){

    const navigate = useNavigate();
    const [carList, setCarList] = useState([]);

    const fetchCarListSequentially = async () => {
        try {
            const response = await axios.get('http://localhost:4000/car/');
            const carListData = response.data;

            // Fetch components sequentially
            const loadedCarList = [];
            for (const car of carListData) {
                const img = new Image();
                img.src = car.imgUrl;
                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedCarList.push({ ...car, loaded: true });
                        resolve();
                    };
                });
            }

            setCarList(loadedCarList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCarListSequentially();
    }, []);

    useEffect(() => {

    },[carList])

    return (
        <div id="cars">
            <Header/>
            <div className="body">
                <div className="filter-section">
                    <div className="details">
                        <FmdGoodOutlinedIcon style={{height: "20px", width: "auto"}}/><p>Ho Chi Minh</p>
                        <CalendarMonthOutlinedIcon style={{height: "20px", width: "auto", paddingLeft: "25px"}}/><p>07:00, 02/02/2024 - 08:00, 03/02/2024</p>
                    </div>
                    <div className="amenities">
                        <div className="amenity reset-btn"><RotateLeftIcon/></div>
                        <div className="amenity car-tpye"><div className="icon"><AirportShuttleOutlinedIcon/></div><p>Loại xe</p></div>
                        <div className="amenity car-brand"><div className="icon"><LanguageIcon/></div><p>Hãng xe</p></div>
                        <div className="amenity five-star-owner"><div className="icon"><StarRoundedIcon style={{color: "rgb(255, 225, 0)"}}/></div><p>Chủ xe 5 sao</p></div>
                        <div className="amenity delivery"><div className="icon"><LocationOnOutlinedIcon/></div><p>Giao xe tận nơi</p></div>
                        <div className="amenity electric-car"><div className="icon"><ElectricCarOutlinedIcon/></div><p>Xe điện</p></div>
                        <div className="amenity gear-shift"><div className="icon"><GiGearStick size={{height: "10px"}} /></div><p>Truyền động</p></div>
                        <div className="amenity all-filter"><div className="icon"><TuneIcon/></div><p>Bộ lọc</p></div>
                    </div>
                </div>
                <div className="car-list">
                    {carList.map((car) =>(
                    <Card key={car.id} id={car.id} year={car.year} price={car.price} description={car.description} image={car.imgUrl} typeId={car.carTypeId}/>
                    ))}
                </div>
                <div className="map-btn" onClick={()=>navigate("/")}><MapIcon/>Bản đồ</div>
            </div>
            <Footer/>
        </div>
    )
}
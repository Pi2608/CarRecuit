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
import MapIcon from '@mui/icons-material/Map';
import { GiGearStick } from "react-icons/gi";
import Popup from "reactjs-popup";
import axios from "axios";
import "./CarList.css";

export default function CarList(){

    const navigate = useNavigate();

    const [carList, setCarList] = useState([]);
    const [carBrandList, setCarBrandList] = useState([]);
    const [filterList, setFilterList]= useState([]);
    const [haveFilter, setHaveFilter] = useState(false);
    const [haveCarType, setHaveCarType] = useState(true);
    const [carTypeId, setCarTypeId] = useState('');
    const [selectedCarSeats, setSelectedCarSeats] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        carTypeId: '',
        seats: [],
        typeOfFuels: '',
        gearStick: '',
        minPrice: '',
        maxPrice: ''
    });
    
    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;

    //     if (name === 'seats' && filterOptions.seats === value) {
    //         if (selectedCarSeats.includes(value)) {
    //             setSelectedCarSeats(selectedCarSeats.filter((seat) => seat !== value));
    //         } else {
    //             setSelectedCarSeats([...selectedCarSeats, value]);
    //         }
    //         setFilterOptions(prevOptions => ({
    //             ...prevOptions,
    //             [name]: selectedCarSeats
    //         }));
    //     }else{
    //         setFilterOptions(prevOptions => ({
    //             ...prevOptions,
    //             [name]: value
    //         }));
    //     }
    // };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'seats') {
            const updatedSeats = selectedCarSeats.includes(value)
                ? selectedCarSeats.filter((seat) => seat !== value)
                : [...selectedCarSeats, value];
    
            setSelectedCarSeats(updatedSeats);
    
            setFilterOptions(prevOptions => ({
                ...prevOptions,
                [name]: updatedSeats
            }));
        } else {
            setFilterOptions(prevOptions => ({
                ...prevOptions,
                [name]: value
            }));
        }
    };
    

    const filteredCars = carList.filter(car => {
        if (filterOptions.carTypeId && car.carTypeId !== filterOptions.carTypeId) {
            return false;
        }
        if (filterOptions.seats.length > 0 && car.seats !== parseInt(filterOptions.seats)) {
            return false;
        }
        if (filterOptions.typeOfFuels && car.typeOfFuels !== filterOptions.typeOfFuels) {
            return false;
        }
        if (filterOptions.gearStick && car.gearStick !== filterOptions.gearStick) {
            return false;
        }
        if (filterOptions.minPrice && car.price < filterOptions.minPrice){
            return false;
        }
        if (filterOptions.maxPrice && car.price > filterOptions.maxPrice){
            return false;
        }
        return true;
    });


    const fetchCarListSequentially = async () => {
        try {
            const response = await axios.get('http://localhost:4000/car/');
            const carListData = response.data;
            // Create an array of promises for each image loading
            const imagePromises = carListData.map((car) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = car.imgUrl;
                    img.onload = () => resolve({ ...car, loaded: true });
                });
            });

            // Wait for all images to be loaded before updating state
            const loadedCarList = await Promise.all(imagePromises);
            setCarList(loadedCarList);
            return loadedCarList
        } catch (error) {
            console.error('Error fetching car list:', error);
        }
    };

    const fetchCarBrandList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/car/brand');
            const data = response.data;
            setCarBrandList(data);
        } catch (error) {
            console.error('Error fetching car brand list:', error);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchData = async () => {
            fetchCarList();
            fetchCarBrandList();
        }
        fetchData();
    },[])

    useEffect(() => {
        setCarList(filterList)
    },[filterList])

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
                        <Popup 
                            trigger={
                                <div className="amenity car-type" style={(filterOptions.seats.length > 0) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} : {}}><div className="icon">        <AirportShuttleOutlinedIcon/>                           </div><p>Loại xe</p>        </div>
                            }
                            contentStyle={{
                                backgroundColor: "white",
                                width: "fit-content",
                                height: "fit-content",
                                padding: "1em 2em 1.5em 2em",
                                borderRadius: "15px",
                            }}
                            modal
                        >
                            {(close) =>(
                                <div id="type-container">
                                    <p style={{fontSize: "22px", fontWeight: "500", paddingBottom: "20px"}}>Loại xe</p>
                                    <hr style={{width: "100%"}}/>
                                    <br />
                                    <div className="type-select" style={{padding: "20px 0 30px 0"}}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("4")) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-mini-v2.png"/>
                                                </div>
                                                <p>Xe 4 chỗ</p>
                                            </div>
                                            <input 
                                                className="checkSeats"
                                                type="checkbox"
                                                name="seats"
                                                checked={filterOptions.seats.includes("4")}
                                                value={"4"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("5")) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} :{}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-sedan-v2.png"/>
                                                </div>
                                                <p>Xe 5 chỗ</p>
                                            </div>
                                            <input 
                                                className="checkSeats"
                                                type="checkbox"
                                                name="seats"
                                                checked={filterOptions.seats.includes("5")}
                                                value={"5"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("6")) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} :{}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/5-suv-v2.png"/>
                                                </div>
                                                <p>Xe 6 chỗ</p>
                                            </div>
                                            <input 
                                                className="checkSeats"
                                                type="checkbox"
                                                name="seats"
                                                checked={filterOptions.seats.includes("6")}
                                                value={"6"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("7")) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} :{}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/7-mpv-v2.png"/>
                                                </div>
                                                <p>Xe 7 chỗ</p>
                                            </div>
                                            <input 
                                                className="checkSeats"
                                                type="checkbox"
                                                name="seats"
                                                checked={filterOptions.seats.includes("7")}
                                                value={"7"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="choose" onClick={close}>Chọn</div>
                                </div>
                            )}
                        </Popup>
                        <div className="amenity car-brand"><div className="icon">       <LanguageIcon/>                                         </div><p>Hãng xe</p>        </div>
                        <div className="amenity five-star-owner"><div className="icon"> <StarRoundedIcon style={{color: "rgb(255, 225, 0)"}}/>  </div><p>Chủ xe 5 sao</p>   </div>
                        <div className="amenity electric-car"><div className="icon">    <ElectricCarOutlinedIcon/>                              </div><p>Xe điện</p>        </div>
                        <div className="amenity gear-shift"><div className="icon">      <GiGearStick size={{height: "10px"}} />                 </div><p>Truyền động</p>    </div>
                        <div className="amenity all-filter"><div className="icon">      <TuneIcon/>                                             </div><p>Bộ lọc</p>         </div>
                    </div>
                </div>
                <div className="car-list">
                    {filteredCars.map((car) =>(
                        <Card key={car.id} id={car.id} name={car.name} price={car.price} description={car.description} image={car.imgUrl} ldescription={car.ldescription  } typeId={car.carTypeId}/>
                    ))}
                </div>
                <div className="map-btn" onClick={()=>navigate("/")}><MapIcon/>Bản đồ</div>
            </div>
            <Footer/>
        </div>
    )
}
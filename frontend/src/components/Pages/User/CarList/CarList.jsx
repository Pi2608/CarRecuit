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
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MapIcon from '@mui/icons-material/Map';
import CartButon from "../../../Items/Cart/Cart";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { GiGearStick } from "react-icons/gi";
import Popup from "reactjs-popup";
import { Modal } from "@mui/material";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from "axios";
import "./CarList.css";

export default function CarList() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [carList, setCarList] = useState([]);
    const [carBrandList, setCarBrandList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [haveFilter, setHaveFilter] = useState(false);
    const [haveCarType, setHaveCarType] = useState(true);
    const [carTypeId, setCarTypeId] = useState('');
    const [selectedCarSeats, setSelectedCarSeats] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        carTypeId: '',
        seats: [],
        rating: false,
        typeOfFuels: '',
        gearStick: '',
        minPrice: '500',
        maxPrice: '2000'
    });

    const storedData = sessionStorage.getItem('items');
    const items = storedData ? JSON.parse(storedData) : null;

    const startDate = items ? items.dateStart : null;
    const endDate = items ? items.dateEnd : null;
    const location = items ? items.location : null;

    const marks = [
        {
            value: 500,
            label: '500',
        },
        {
            value: 1000,
            label: '1000',
        },
        {
            value: 1500,
            label: '1500',
        },
        {
            value: 2000,
            label: '2000',
        },
    ]

    const PrettoSlider = styled(Slider)({
        color: '#5fcf86',
        height: 8,
        '& .MuiSlider-track': {
            border: 'none',
        },
        '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
            },
            '&::before': {
                display: 'none',
            },
        },
        '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: '#52af77',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&::before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
                transform: 'rotate(45deg)',
            },
        },
    });

    const handleChangePrice = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        let newMinPrice, newMaxPrice;

        if (activeThumb === 0) {
            newMinPrice = Math.min(newValue[0], filterOptions.maxPrice - 500);
            newMaxPrice = filterOptions.maxPrice;
        } else {
            newMaxPrice = Math.max(newValue[1], filterOptions.minPrice + 500);
            newMinPrice = filterOptions.minPrice;
        }

        setFilterOptions(prevOptions => ({
            ...prevOptions,
            minPrice: newMinPrice,
            maxPrice: newMaxPrice,
        }));
    };

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
        } else if (name === 'typeOfFuels') {
            const updatedFuel = filterOptions.typeOfFuels === value
                ? ""
                : value;

            setFilterOptions(prevOptions => ({
                ...prevOptions,
                [name]: updatedFuel
            }));
        } else if (name === 'gearStick') {
            const updatedGear = filterOptions.gearStick === value
                ? ""
                : value;

            setFilterOptions(prevOptions => ({
                ...prevOptions,
                [name]: updatedGear
            }));
        } else {
            setFilterOptions(prevOptions => ({
                ...prevOptions,
                [name]: value
            }));
        }
    };

    const handeGetAllClick = async () => {
        const response = await axios.get('http://localhost:4000/car/')
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
    }

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const filteredCars = carList.filter(car => {
        if (filterOptions.carTypeId && car.carTypeId !== filterOptions.carTypeId) {
            return false;
        }
        if (filterOptions.seats.length > 0 && car.seats !== parseInt(filterOptions.seats)) {
            return false;
        }
        if (filterOptions.rating && car.rating !== 5) {
            return false;
        }
        if (filterOptions.typeOfFuels && car.typeOfFuels !== filterOptions.typeOfFuels) {
            return false;
        }
        if (filterOptions.gearStick && car.gearStick !== filterOptions.gearStick) {
            return false;
        }
        if (filterOptions.minPrice && car.price < filterOptions.minPrice) {
            return false;
        }
        if (filterOptions.maxPrice && car.price > filterOptions.maxPrice) {
            return false;
        }
        return true;
    });


    const fetchCarList = async () => {
        try {
            const postData = {
                location: location,
                dateStart: startDate,
                dateEnd: endDate
            }
            console.log(location, startDate, endDate)
            const response = await axios.post('http://localhost:4000/car/filterLocationDate', postData)
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

    function displayPeriod(startDate, endDate) {
        const tempStartDate = handleDateTime(startDate);
        const tempEndDate = handleDateTime(endDate);
        const rs = `${tempStartDate} - ${tempEndDate}`;
        return rs;
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
    }, [])

    useEffect(() => {
        setCarList(filterList)
    }, [filterList])

    return (
        <div id="cars">
            <Header />
            <div className="body">
                <div className="filter-section">
                    <div className="details">
                        <FmdGoodOutlinedIcon style={{ height: "20px", width: "auto" }} /><p>Ho Chi Minh</p>
                        <CalendarMonthOutlinedIcon style={{ height: "20px", width: "auto", paddingLeft: "25px" }} /><p>{displayPeriod(startDate, endDate)}</p>
                    </div>
                    <div className="amenities">
                        <div
                            className="amenity reset-btn"
                            onClick={() => setFilterOptions({ carTypeId: '', seats: [], rating: false, typeOfFuels: '', gearStick: '', minPrice: '500', maxPrice: '2000' })}
                            style={(filterOptions.carTypeId || filterOptions.gearStick || filterOptions.rating || filterOptions.seats.length > 0 || (parseInt(filterOptions.minPrice) !== 500 || parseInt(filterOptions.maxPrice) !== 2000)) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}
                        ><RotateLeftIcon /></div>
                        <Popup
                            trigger={
                                <div className="amenity car-type" style={(filterOptions.seats.length > 0) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}><div className="icon">        <AirportShuttleOutlinedIcon />                           </div><p>Loại xe</p>        </div>
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
                            {(close) => (
                                <div id="type-container">
                                    <p style={{ fontSize: "22px", fontWeight: "500", paddingBottom: "20px" }}>Loại xe</p>
                                    <hr style={{ width: "100%" }} />
                                    <br />
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("4")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-mini-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("5")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-sedan-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("6")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/5-suv-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("7")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/7-mpv-v2.png" />
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
                                    <div className="choose" onClick={close}>Áp dụng</div>
                                </div>
                            )}
                        </Popup>
                        {/* <Popup
                            trigger={
                                <div className="amenity car-brand"><div className="icon">       <LanguageIcon/>                                         </div><p>Hãng xe</p>        </div>
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
                            <div id="type-container">
                                <p style={{fontSize: "22px", fontWeight: "500", paddingBottom: "20px"}}>Chọn hãng xe</p>
                                <hr style={{width: "100%"}}/>
                                <br />
                                
                                <div className="choose" onClick={close}>Áp dụng</div>
                            </div>
                        </Popup> */}
                        <div
                            className="amenity five-star-owner"
                            style={(filterOptions.rating) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}
                            onClick={() => setFilterOptions(prevOptions => ({ ...prevOptions, rating: !filterOptions.rating }))}
                        ><div className="icon"> <StarRoundedIcon style={{ color: "rgb(255, 225, 0)" }} />  </div><p>Chủ xe 5 sao</p>   </div>
                        <Popup
                            trigger={
                                <div className="amenity electric-car" style={(filterOptions.typeOfFuels) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}><div className="icon">    <LocalGasStationIcon />                              </div><p>Loại nhiên liệu</p>        </div>
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
                            {(close) => (
                                <div id="type-container">
                                    <p style={{ fontSize: "22px", fontWeight: "500", paddingBottom: "20px" }}>Loại nhiên liệu</p>
                                    <hr style={{ width: "100%" }} />
                                    <br />
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Xăng") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Xăng</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Xăng"}
                                                value={"Xăng"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Dầu diesel") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Dầu Diesel</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Dầu Diesel"}
                                                value={"Dầu diesel"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Điện") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Điện</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Điện"}
                                                value={"Điện"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="choose" onClick={close}>Áp dụng</div>
                                </div>
                            )}
                        </Popup>
                        <Popup
                            trigger={
                                <div className="amenity gear-shift" style={(filterOptions.gearStick) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}><div className="icon">      <GiGearStick size={{ height: "10px" }} />                 </div><p>Truyền động</p>    </div>
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
                            {(close) => (
                                <div id="type-container">
                                    <p style={{ fontSize: "22px", fontWeight: "500", paddingBottom: "20px" }}>Truyền động</p>
                                    <hr style={{ width: "100%" }} />
                                    <br />
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.gearStick === "Số tự động") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Số tự động</p>
                                            </div>
                                            <input
                                                className="checkgearStick"
                                                type="checkbox"
                                                name="gearStick"
                                                checked={filterOptions.gearStick === "Số tự động"}
                                                value={"Số tự động"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.gearStick === "Số sàn") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Số sàn</p>
                                            </div>
                                            <input
                                                className="checkgearStick"
                                                type="checkbox"
                                                name="gearStick"
                                                checked={filterOptions.gearStick === "Số sàn"}
                                                value={"Số sàn"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div className="choose" onClick={close}>Áp dụng</div>
                                </div>
                            )}
                        </Popup>
                        <div className="amenity all-filter" onClick={handleOpen} style={(filterOptions.carTypeId || filterOptions.gearStick || filterOptions.rating || filterOptions.seats.length > 0 || (parseInt(filterOptions.minPrice) !== 500 || parseInt(filterOptions.maxPrice) !== 2000)) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}><div className="icon">      <TuneIcon />                                             </div><p>Bộ lọc</p>         </div>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            disableEnforceFocus
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            style={{ height: "80vh", width: "fit-content", display: "flex", justifyContent: "center", borderRadius: "25px" }}
                        >
                            <div id="type-container-mui">
                                <div className="modal">
                                    <p style={{ fontSize: "22px", fontWeight: "500", paddingBottom: "20px" }}>Bộ lọc nâng cao</p>
                                    <hr style={{ width: "100%" }} />
                                    <br />
                                    <div style={{ width: "100%" }}>
                                        <p>Số chỗ</p>
                                    </div>
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.seats.includes("4")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-mini-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("5")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/4-sedan-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("6")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/5-suv-v2.png" />
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
                                            <div className="icon" style={(filterOptions.seats.includes("7")) ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <div className="img-container">
                                                    <img src="https://n1-cstg.mioto.vn/m/vehicle-types/7-mpv-v2.png" />
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
                                    <div style={{ width: "100%" }}>
                                        <p>Loại nhiên liệu</p>
                                    </div>
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Xăng") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Xăng</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Xăng"}
                                                value={"Xăng"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Dầu diesel") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Dầu Diesel</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Dầu Diesel"}
                                                value={"Dầu diesel"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.typeOfFuels === "Điện") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Điện</p>
                                            </div>
                                            <input
                                                className="checkTypeOfFuels"
                                                type="checkbox"
                                                name="typeOfFuels"
                                                checked={filterOptions.typeOfFuels === "Điện"}
                                                value={"Điện"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <p>Truyền động</p>
                                    </div>
                                    <div className="type-select" style={{ padding: "20px 0 30px 0" }}>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.gearStick === "Số tự động") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Số tự động</p>
                                            </div>
                                            <input
                                                className="checkgearStick"
                                                type="checkbox"
                                                name="gearStick"
                                                checked={filterOptions.gearStick === "Số tự động"}
                                                value={"Số tự động"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label className="tp">
                                            <div className="icon" style={(filterOptions.gearStick === "Số sàn") ? { border: "1px solid #5fcf86", backgroundColor: "#C4FFD0" } : {}}>
                                                <p>Số sàn</p>
                                            </div>
                                            <input
                                                className="checkgearStick"
                                                type="checkbox"
                                                name="gearStick"
                                                checked={filterOptions.gearStick === "Số sàn"}
                                                value={"Số sàn"}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <p>Mức giá</p>
                                    </div>
                                    <Box sx={{ width: "400px", padding: "10px" }}>
                                        <PrettoSlider
                                            getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                                            min={500}
                                            max={2000}
                                            step={null}
                                            marks={marks}
                                            value={[parseInt(filterOptions.minPrice), parseInt(filterOptions.maxPrice)]}
                                            onChange={handleChangePrice}
                                            valueLabelDisplay="auto"
                                            aria-label="pretto slider"
                                        />
                                    </Box>
                                    <div className="choose" onClick={handleClose}>Áp dụng</div>
                                </div>
                            </div>
                        </Modal>
                        <div
                            className="amenity cars-all"
                            onClick={() => { handeGetAllClick() }}
                        ><p>Xem tất cả</p></div>
                    </div>
                </div>
                <div className="list-container">
                    <div className="car-list">
                        {filteredCars.map((car) => (
                            <Card key={car.id} id={car.id} name={car.name} price={car.price} description={car.description} image={car.imgUrl} ldescription={car.ldescription} typeId={car.carTypeId} />
                        ))}
                    </div>
                </div>
                <div className="map-btn" onClick={() => navigate("/map")}><MapIcon />Bản đồ</div>
                <CartButon />
            </div>
            <Footer />
        </div>
    )
}
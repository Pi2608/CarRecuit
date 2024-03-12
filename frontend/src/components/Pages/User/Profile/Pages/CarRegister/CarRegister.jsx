import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../../../Context/AuthProvider'
import { MenuItem, TextField } from '@mui/material'
import Header from '../../../../../Items/Header/Header'
import Footer from '../../../../../Items/Footer/Footer'
import axios from 'axios'
import "./CarRegister.css"

export default function CarRegister() {

    const { auth , id } = useAuth()

    const currentYear = new Date().getFullYear();

    const [ brandList, setBrandList ] = useState([]);
    const [ modelList, setModelList ] = useState([]);
    const [ amenities,  setAmenities ] = useState([]);

    const [ carBrand, setCarBrand ] = useState("");

    const [ carModel, setCarModel ] = useState("");
    const [ CLP, setCLP ] = useState("");
    const [ carPrice, setCarPrice ] = useState("");
    const [ carDescription, setCarDescription ] = useState("");
    const [ carSeats, setCarSeats ] = useState("");
    const [ carYear, setCarYear ] = useState("");
    const [ carGearStick, setCarGearStick ] = useState("");
    const [ carFuel, setCarFuel ] = useState("");
    const [ selectedAmenities, setSelectedAmenities ] = useState([]);

    function handleAmenityToggle(amenityId){
        if (selectedAmenities.includes(amenityId)) {
          setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
        } else {
          setSelectedAmenities([...selectedAmenities, amenityId]);
        }
    }

    async function getAmenities() {
        try {
          const response = await axios.get('http://localhost:4000/amenities/');
          const data = response.data;
          setAmenities(data); 
        } catch (error) {
          console.error('Error fetching amenities: ', error);
        }
    }

    async function getBrand(){
        try {
            const response = await axios.get('http://localhost:4000/car/brand/');
            const data = response.data;
            setBrandList(data)
        } catch (error) {   
            console.error('Error fetching car brand: ', error);
        }
    }

    async function getModel(brandId){
        try {
            const response = await axios.get(`http://localhost:4000/car/type/brand/${brandId}`);
            const data = response.data;
            setModelList(data)
        } catch (error) {   
            console.error('Error fetching car brand: ', error);
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            await getBrand();
            await getAmenities();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (carBrand) {
            console.log(carBrand);
            getModel(carBrand);
        }
    }, [carBrand]);

    useEffect(() => {
        console.log(selectedAmenities);
    },[selectedAmenities])
//
    return(
        <div id="carregister">
            <Header />
            <div className="body">
                <h1 style={{paddingBottom: "1em"}}>Đăng kí xe</h1>
                <div className="form-container">
                    <label htmlFor="CLP">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Biển số xe</p>
                        <p style={{color:"red"}}>Lưu ý: Biển số sẽ không thể thay đổi sau khi đăng kí.</p>
                        <br />
                        <TextField 
                            id='CLP'
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            onChange={(e) => setCLP(e.target.value)}
                            value={CLP}
                            required
                            />  
                    </label>
                    <br />
                    <br />
                    <div className="info-section">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Thông tin cơ bản</p>
                        <p style={{color:"red"}}>Lưu ý: Các thông tin cơ bản sẽ không thể thay đổi sau khi đăng kí.</p>
                        <br />
                        <div className="car-info">
                            <label htmlFor="car-brand">
                                <p>Hãng xe</p>
                                <TextField 
                                id='car-brand'
                                select 
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarBrand(e.target.value)}
                                value={carBrand}
                                required
                                >
                                    {brandList?.map((brand) =>(
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </label>
                            <label htmlFor="car-model">
                                <p>Mẫu xe</p>
                                <TextField 
                                id='car-model'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarModel(e.target.value)}
                                value={carModel}
                                required
                                >
                                    {modelList?.map((model) =>(
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </label>
                            <label htmlFor="car-seat">
                                <p>Số ghế</p>
                                <TextField 
                                id='car-seat'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarSeats(e.target.value)}
                                value={carSeats}
                                required
                                >
                                    <MenuItem value="4">
                                        4
                                    </MenuItem>
                                    <MenuItem value="7">
                                        7
                                    </MenuItem>
                                    <MenuItem value="16">
                                        16
                                    </MenuItem>
                                    <MenuItem value="24">
                                        24
                                    </MenuItem>
                            </TextField>
                            </label>
                            <label htmlFor="car-year">
                                <p>Năm sản xuất</p>
                                <TextField 
                                id='car-year'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarYear(e.target.value)}
                                value={carYear}
                                required
                                >
                                    {Array.from({ length: currentYear - 1999 }, (_, index) => {
                                        const year = currentYear - index;
                                        return (
                                            <MenuItem value={year.toString()}>
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </label>
                            <label htmlFor="car-gear-stick">
                                <p>Truyền động</p>
                                <TextField 
                                id='car-gear-stick'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarGearStick(e.target.value)}
                                value={carGearStick}
                                required
                                >
                                    <MenuItem value="24">
                                        Số tự động
                                    </MenuItem>
                                    <MenuItem value="">
                                        Số sàn
                                    </MenuItem>
                                </TextField>
                            </label>
                            <label htmlFor="car-fuel">
                                <p>Loại nhiên liệu</p>
                                <TextField 
                                id='car-fuel'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarFuel(e.target.value)}
                                value={carFuel}
                                required
                                >
                                    <MenuItem value="24">
                                        Xăng
                                    </MenuItem>
                                    <MenuItem value="24">
                                        Dầu diesel
                                    </MenuItem>
                                    <MenuItem value="24">
                                        Điện
                                    </MenuItem>
                                </TextField>
                            </label>
                        </div>
                        <br />
                        <label htmlFor="description">
                            <p style={{fontWeight: "500", fontSize: "18px"}}>Mô tả</p>
                            <TextField
                                id='description'
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => setCarDescription(e.target.value)}
                                value={carDescription}
                            />
                        </label>
                        <br />
                        <br />
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Các tính năng</p>
                        <br />
                        <div className="amenity-container">
                            {amenities.map((amenity) => (
                                <div className="toggle-btn" key={amenity.id}>
                                    <label className={`amenity ${selectedAmenities.includes(amenity.id) ? 'selected' : ''}`}>
                                        <div className="amenity" style={(selectedAmenities.includes(amenity.id)) ? {border: "1px solid #5fcf86"} : {border: "1px solid #ccc"}}>
                                            {amenity.id === 1 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/map-v2.png"></img>}
                                            {amenity.id === 2 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/bluetooth-v2.png"></img>}
                                            {amenity.id === 3 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/360_camera-v2.png"></img>}
                                            {amenity.id === 4 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/parking_camera-v2.png"></img>}
                                            {amenity.id === 5 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/dash_camera-v2.png"></img>}
                                            {amenity.id === 6 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/reverse_camera-v2.png"></img>}
                                            {amenity.id === 7 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/tpms-v2.png"></img>}
                                            {amenity.id === 8 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/impact_sensor-v2.png"></img>}
                                            {amenity.id === 9 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/head_up-v2.png"></img>}
                                            {amenity.id === 10 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/sunroof-v2.png"></img>}
                                            {amenity.id === 11 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/gps-v2.png"></img>}
                                            {amenity.id === 12 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/babyseat-v2.png"></img>}
                                            {amenity.id === 13 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/usb-v2.png"></img>}
                                            {amenity.id === 14 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/spare_tire-v2.png"></img>}
                                            {amenity.id === 15 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/dvd-v2.png"></img>}
                                            {amenity.id === 16 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/bonnet-v2.png"></img>}
                                            {amenity.id === 17 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/etc-v2.png"></img>}
                                            {amenity.id === 18 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/airbags-v2.png"></img>}
                                            <p>{amenity.name}</p>
                                            <input
                                            type="checkbox"
                                            checked={selectedAmenities.includes(amenity.id)}
                                            onChange={() => handleAmenityToggle(amenity.id)}
                                            />
                                        </div>
                                    </label>
                                </div>
                            ))}             
                        </div>
                    </div>
                    <br /><br />
                    <div className="renting-section">
                        <label htmlFor="car-price">
                            <p style={{fontWeight: "500", fontSize: "18px"}}>Đơn giá xe mặc định</p>
                            <p>Đơn giá áp dụng cho tất cả các ngày. Bạn có thuể tuỳ chỉnh giá trong mục quản lý xe sau khi đăng kí.</p>
                            <p>Giá đề xuất: 800K</p>
                            <br />
                            <TextField
                                id="car-price"
                                type="number"
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarPrice(e.target.value)}
                                value={carPrice}
                            />
                            <p>K</p>
                        </label>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
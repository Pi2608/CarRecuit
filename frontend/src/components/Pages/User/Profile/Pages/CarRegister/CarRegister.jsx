import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import Header from '../../../../../Items/Header/Header'
import Footer from '../../../../../Items/Footer/Footer'
import "./CarRegister.css"

export default function CarRegister() {

    const [ NDL, setNDL ] = useState("");
    const [ carBrand, setCarBrand ] = useState("");
    const [ carModel, setCarModel ] = useState("");
    const [ carSeats, setCarSeats ] = useState("");
    const [ carYear, setCarYear ] = useState("");
    const [ carGearStick, setCarGearStick ] = useState("");
    const [ carFuel, setCarFuel ] = useState("");

    const [ amenities,  setAmenities ] = useState([]);

    async function getAmenities() {
        try {
          const response = await fetch('http://localhost:4000/amenities/');
          const data = await response.json();
          setAmenities(data); 
        } catch (error) {
          console.error('Error fetching amenities:', error);
        }
      }
    
      useEffect(() => {
        getAmenities();
        console.log(amenities);
      }, []);

    return(
        <div id="carregister">
            <Header />
            <div className="body">
                <h1 style={{paddingBottom: "1em"}}>Đăng kí xe</h1>
                <div className="form-container">
                    <label htmlFor="NDL">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Biển số xe</p>
                        <p style={{color:"red"}}>Lưu ý: Biển số sẽ không thể thay đổi sau khi đăng kí.</p>
                        <br />
                        <TextField 
                            id='NDL'
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            onChange={{}}
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                                />
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
                                onChange={{}}
                            />
                        </label>

                        <br />
                        <br />
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Các tính năng</p>
                        <br />
                        <div className="amenity-container">
                        {amenities.map((amenity) => (
                            <label className="toggle-btn">
                                <div className="amenity">
                                    <div className="icon"></div>
                                    <p>{amenity.name}</p>
                                </div>
                            </label>
                        ))}             
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
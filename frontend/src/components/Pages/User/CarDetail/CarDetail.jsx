import React, { useEffect, useState } from "react";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import CarImg1 from "../../../../images/Hyundai-accent-2022-1.jpg"
import CarImg2 from "../../../../images/Hyundai-accent-2022-2.jpg"
import CarImg3 from "../../../../images/Hyundai-accent-2022-3.jpg"
import CarImg4 from "../../../../images/Hyundai-accent-2022-4.jpg"
import Button from '@mui/material/Button';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DiscountIcon from '@mui/icons-material/Discount';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { GiGearStickPattern } from "react-icons/gi";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EvStationIcon from '@mui/icons-material/EvStation';
import "./CarDetail.css";

export default function CarDetail(){

    const [carImages, setCarImages] = useState([]);
    const [carsSeats, setCarsSeats] = useState(0);
    const [carGear, setCarGear] = useState('');
    const [carFuel, setCarFuel] = useState(true);
    const [carPrize, setCarPrize] = useState('');
    const [rentDate, setRentDate] = useState([]);
    const [returnDate, setReturnDate] = useState([]);
    
    useEffect(() => {
        window.scrollTo(0, 0)
    },[])

    return(
        <div id="car-detail">
            <Header/>
            <div className="body">
                <div className="img-container">
                    <img src={CarImg1} alt="" className="item-1"/>
                    <img src={CarImg2} alt="" className="item-2"/>
                    <img src={CarImg3} alt="" className="item-3"/>
                    <img src={CarImg4} alt="" className="item-4"/>
                </div>
                <div className="car-info">
                    <div className="info">
                        <div className="name">
                            <p>Hyundai accent 2022</p>
                        </div>
                        <div className="rating">
                            <StarRoundedIcon style={{color: "rgb(255, 225, 0)"}}/><p>5.0</p><div className="dot"><FiberManualRecordIcon style={{height: "10px", color: "#b2b2b2"}}/></div><p>Quận 8, Hồ Chí Minh</p>
                        </div>
                        <hr/>
                        <div className="character">
                            <div className="titl">
                                <p style={{fontSize: "1.2em", fontWeight: "500"}}>Đặc điểm</p>       
                            </div>
                            <br />
                            <div className="character-container">
                                <div className="char">
                                    <div className="icon"><DirectionsCarFilledOutlinedIcon style={{height: "45px", width: "auto"}}/></div>
                                    <div className="tittle">
                                        <p>Số ghế</p>
                                        <p style={{fontSize: "1.5em", fontWeight: "500", lineHeight: "1.7"}}>5 chỗ</p>
                                    </div>
                                </div>
                                <div className="char">
                                    <div className="icon"><GiGearStickPattern style={{height: "45px", width: "auto"}}/></div>
                                    <div className="tittle">
                                        <p>Truyền động</p>
                                        <p style={{fontSize: "1.5em", fontWeight: "500", lineHeight: "1.7"}}>Số sàn</p>
                                    </div>
                                </div>
                                <div className="char">
                                    <div className="icon"><LocalGasStationIcon style={{height: "45px", width: "auto"}}/></div>
                                    <div className="tittle">
                                        <p>Nhiên liệu</p>
                                        <p style={{fontSize: "1.5em", fontWeight: "500", lineHeight: "1.7"}}>Xăng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="amenities">
                            <div className="titl" style={{fontSize: "1.2em", fontWeight: "500"}}>
                                Các tiện nghi khác 
                            </div>
                        </div>
                        <hr/>
                    </div>
                    <div className="price">
                        <h1>850k/ngày</h1>
                        <div className="period">
                            <div className="book">
                                <table>
                                    <tr>
                                        <td>Nhận xe</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>02/02/2024</td>
                                        <td style={{paddingLeft: "10px"}}>7:00</td>
                                    </tr>
                                </table>
                            </div>
                            <div className="vertical-line"></div>
                            <div className="return">
                                <table>
                                    <tr>
                                        <td>Trả xe</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>03/02/2024</td>
                                        <td style={{paddingLeft: "10px"}}>8:00</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <br/>
                        <div className="location">
                            <div>Địa điểm giao xe</div>
                            <div className="address">Quận 8, Hồ Chí Minh</div>
                        </div>
                        <br/>
                        <hr style={{padding: "0 21px"}}/>
                        <div className="charge-section">
                            <div>
                                <p>Đơn giá thuê</p>
                                <p>850.000 đ/ngày</p>
                            </div>
                            <div>
                                <p>Bảo hiểm thuê xe</p>
                                <p>85.000 đ/ngày</p>
                            </div>
                        </div>
                        <hr style={{padding: "0 21px"}}/>
                        <div className="total">
                            <div>Tổng cộng</div>
                            <div>935.000 đ x 2 ngày</div>
                        </div>
                        <hr/>
                        <div className="voucher">
                            <div>
                                <DiscountIcon style={{height: "16px"}}/><p>Mã khuyến mãi</p>
                            </div>
                            <div><ArrowForwardIosIcon style={{height: "16px"}}/></div>
                        </div>
                        <hr/>
                        <div className="payment">
                            <p>Thành tiền</p>
                            <p>1.870.000 đ</p>
                        </div>
                        <Button variant="contained">Thanh toán</Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
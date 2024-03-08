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
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CarDetail.css";

export default function CarDetail(){

    const { carId } = useParams();

    const [ carImages, setCarImages ] = useState([]);
    const [ carImage1, setCarImage1 ] = useState([]);
    const [ carImage2, setCarImage2 ] = useState([]);
    const [ carImage3, setCarImage3 ] = useState([]);
    const [ carImage4, setCarImage4 ] = useState([]);

    const [ carInfo, setCarInfo ] = useState([]);
    const [ carName, setCarName ] = useState([]);
    const [ carSeats, setCarSeats ] = useState(0);
    const [ carGear, setCarGear ] = useState('');
    const [ carFuel, setCarFuel ] = useState(true);
    const [ carPrice, setCarPrice ] = useState('');
    const [ rentDate, setRentDate ] = useState([]);
    const [ returnDate, setReturnDate ] = useState([]);
    const [ insurancePrice, setInsurancePrice ] = useState('')
    const [ totalPrice, setTotalPrice ] = useState('')

    async function getCarDetails() {
        try {
            const response = await axios.get(`http://localhost:4000/car/${carId}`);
            const data = response.data;
            const imageListData = data[1];

            const imagesPromise = imageListData.map((image)=>{
                return new Promise((resolve) =>{
                    const img = new Image();
                    img.src = image.url;
                    img.onload = () => resolve({...image, loaded: true});
                });
            });
            const loadedImageList = await Promise.all(imagesPromise);
            setCarInfo(data[0]);
            setCarImages(loadedImageList);
            return data[0].carTypeId;
        } catch (error) {
            console.log("Error getting car details: " + error);
        }
    }

    async function getCarTypes(typeId) {
        try {
            const response = await axios.get(`http://localhost:4000/car/type/${typeId}`);
            const data = response.data;
            setCarName(data.name)
        } catch (error) {
            console.log("Error getting car type: " + error);
        }
    }
    
    useEffect(() => {
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        const fetchData = () => {
            getCarDetails()
                .then((typeId) => getCarTypes(typeId))
                .catch((error) => console.error('Error fetching data:', error));
        }
        fetchData();
    },[])

    useEffect(() => {
        if (carInfo) {
            setCarSeats(carInfo.seats);
            setCarFuel(carInfo.typeOfFuels);
            setCarPrice(carInfo.price);
            setInsurancePrice(insuranceCalculate(carInfo.price))
            setTotalPrice(calculateTotalPrice(carInfo.price))
            // console.log(carImages[0].url);
            setCarImage1(carImages[0])
            setCarImage2(carImages[1])
            setCarImage3(carImages[2])
            setCarImage4(carImages[3])
        }
    },[carInfo])

    function insuranceCalculate(input){
        if (input) {
            let priceString = input;
            let insurance = parseInt(priceString, 10);
            insurance = insurance/10;
            priceString = `${insurance}K/ngày`;

            return priceString
        }
    }

    function calculateTotalPrice(input){
        if(input){
            let priceString = input;
            let priceInt = parseInt(priceString, 10);
            let total = (priceInt/10) + priceInt;
            priceString = `${total}`;
            return priceString;
        }
    }

    return(
        <div id="car-detail">
            <Header/>
            <div className="body">
                <div className="img-container">
                    <img src={carImage1.url} alt="" className="item-1"/>
                    <img src={carImage2.url} alt="" className="item-2"/>
                    <img src={carImage3.url} alt="" className="item-3"/>
                    <img src={carImage4.url} alt="" className="item-4"/>
                </div>
                <div className="car-info">
                    <div className="info">
                        <div className="name">
                            {(carName && carInfo.year) ? 
                                <p>{carName + " " + carInfo.year}</p>
                            :
                                <p>Car</p>
                            } 
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
                                        <p style={{fontSize: "1.5em", fontWeight: "500", lineHeight: "1.7"}}>{carInfo.seats} chỗ</p>
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
                                        <p style={{fontSize: "1.5em", fontWeight: "500", lineHeight: "1.7"}}>{carInfo.typeOfFuels}</p>
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
                        <h1>{carInfo.price}K</h1>
                        <div className="period">
                            <div className="book">
                                <table>
                                    <tr>
                                        <td style={{textAlign: "left", fontWeight: "490"}}>Nhận xe</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "left", fontWeight: "490"}}>02/02/2024</td>
                                        <td style={{paddingLeft: "10px", fontWeight: "490"}}>7:00</td>
                                    </tr>
                                </table>
                            </div>
                            <div className="vertical-line"></div>
                            <div className="return">
                                <table>
                                    <tr>
                                        <td style={{textAlign: "left", fontWeight: "490"}}>Trả xe</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "left", fontWeight: "490"}}>03/02/2024</td>
                                        <td style={{paddingLeft: "10px", fontWeight: "490"}}>8:00</td>
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
                                <p style={{fontWeight: "490"}}>Đơn giá thuê</p>
                                <p style={{fontWeight: "490"}}>{carInfo.price}K/ngày</p>
                            </div>
                            <div>
                                <p style={{fontWeight: "490"}}>Bảo hiểm thuê xe</p>
                                <p style={{fontWeight: "490"}}>{insurancePrice}</p>
                            </div>
                        </div>
                        <hr style={{padding: "0 21px"}}/>
                        <div className="total">
                            <div>Tổng cộng</div>
                            <div>{totalPrice}K x 2 ngày</div>
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
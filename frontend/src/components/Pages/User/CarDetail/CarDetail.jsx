import React, { useEffect, useState } from "react";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DiscountIcon from '@mui/icons-material/Discount';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { GiGearStickPattern } from "react-icons/gi";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import Rating from '@mui/material/Rating';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import locale from 'date-fns/locale/vi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useAuth } from "../../../../Context/AuthProvider";
import { useParams } from "react-router-dom";
import CartButon from "../../../Items/Cart/Cart";
import LoginForm from "../../Login/LoginForm/LoginForm";
import dayjs from "dayjs";
import Modal from '@mui/material/Modal';
import Popup from "reactjs-popup";
import axios from "axios";
import "./CarDetail.css";

export default function CarDetail(){

    const { auth, id } = useAuth();

    const { carId } = useParams();
    
    const today = new Date();
    
    const [ open, setOpen ] = useState(false);
    const [ openMsg, setOpenMsg ] = useState(false);
    const [ msg, setMsg ] = useState("")
    const [ carImages, setCarImages ] = useState([]);
    const [ userInfo, setUserInfo ] = useState([]);
    const [ feedback, setFeedback ] = useState([]);
    const [ feedbackDetail, setFeedbackDetail ] = useState([]);
    const [ userNIDInfo, setUserNIDInfo ] = useState([]);
    const [ userNDLInfo, setUserNDLInfo ] = useState([]);
    const [ carInfo, setCarInfo ] = useState([]);
    const [ carSeats, setCarSeats ] = useState(0);
    const [ carFuel, setCarFuel ] = useState(true);
    const [ carPrice, setCarPrice ] = useState('');
    const [ carAmenities, setCarAmenities ] = useState([]);
    const [ insurancePrice, setInsurancePrice ] = useState('')
    const [ totalPrice, setTotalPrice ] = useState(0)
    const [ totalDate, setTotalDate ] = useState(0)
    const [ rentTotal, setRentTotal ] = useState(0)
    const [ boundDate, setBoundDate ] = useState(new Date())
    const [ startDate, setStartDate ] = useState(new Date())
    const [ endDate, setEndDate ] = useState(new Date())
    const [ maxDate, setMaxDate ] = useState(new Date())
    const [ wallet, setWallet ] = useState('')
    const [ filterDateTime,setFilterDateTime ] = useState('');
    const [ date, setDate ] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })

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
            setCarAmenities(data[2]);
            setCarImages(loadedImageList);
            return data[0].carTypeId;
        } catch (error) {
            console.log("Error getting car details: " + error);
        }
    }

    async function getUserInfo(){
        try {
            const response = await axios.get(`http://localhost:4000/user/${id}`);
            const data = response.data;
            setUserInfo(data)
            setWallet(Math.round(data.wallet));
            return data.id
        } catch (error) {
            console.error("Error fetching User Info: " + error)
        }
    }

    async function getUserNid(id){
        try {
            const response = await axios.get(`http://localhost:4000/user/NID/${id}`);
            const data = response.data;
            setUserNIDInfo(data[0]); 
        } catch (error) {
            console.error("Error fetching NID: " + error)
        }
    }

    async function getUserNdl(id){
        try {
            const response = await axios.get(`http://localhost:4000/user/NDL/${id}`);
            const data = response.data;
            setUserNDLInfo(data[0]); 
        } catch (error) {
            console.error("Error fetching NDL: " + error)
        }
    }

    async function addCar(){
        try {
            console.log(startDate)
            console.log(endDate)
            const postData = {
                pick_up: startDate,
                drop_off: endDate,
            } 
            const response = await axios.post(`http://localhost:4000/rent/addCar?userId=${id}&carId=${carId}`, postData);
            const data = response.data;
            console.log(data);
            setMsg(data)
            if (data.message !== null || data.message !== ""){
                setMsg(data.message);
            }
            handleOpenMsg();
        } catch (error) {
            console.error("Error adding car: " + error)
        }
    }

    async function getFeedbacks() {
        try {
            const response = await axios.get(`http://localhost:4000/car/feedback/${carId}`);
            const feedbackListData = response.data;
            if (response.data.length > 0) {
                const feedbackDataPromise = feedbackListData.map(async (feedback) => {
                    try {
                        const userResponse = await axios.get(`http://localhost:4000/user/${feedback.userId}`);
                        const userData = userResponse.data;
                        const userName = userData.name; // Assuming the user's name is stored in a property named 'name'
        
                        const imagePromise = new Promise((resolve) => {
                            const img = new Image();
                            img.src = userData.imgUrl; // Assuming the user's image URL is stored in a property named 'imgUrl'
                            img.onload = () => resolve(img.src);
                            img.onerror = () => resolve(null);
                        });
        
                        const imageUrl = await imagePromise;
        
                        return {
                            feedback,
                            userName,
                            userImage: imageUrl
                        };
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        return null;
                    }
                });
                const feedbackData = await Promise.all(feedbackDataPromise);
                setFeedback(feedbackData.filter(feedback => feedback !== null));
                setFeedbackDetail(feedbackData.filter(feedback => feedback !== null)[0].feedback);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }
    
    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleOpenMsg = () => {setOpenMsg(true); console.log("open")};

    const handleCloseMsg = () => setOpenMsg(false);

    // const getDates = () => {
    //     var today = new Date();
    //     boundDate.setDate(today.getDate() + 4)
    //     maxDate.setMonth(boundDate.getMonth() + 1)
    //     startDate.setDate(boundDate.getDate())
    //     startDate.setHours(7, 0, 0, 0)
    //     endDate.setDate(today.getDate() + 5)
    //     endDate.setHours(7, 0, 0, 0);
    // }

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchData = async () => {
            await getCarDetails();
            await getFeedbacks();
        }
        fetchData();
        var today = new Date();
        boundDate.setDate(today.getDate() + 4)
        maxDate.setMonth(boundDate.getMonth() + 1)
        startDate.setDate(boundDate.getDate())
        startDate.setHours(7, 0, 0, 0)
        endDate.setDate(startDate.getDate() + 1)
        endDate.setHours(7, 0, 0, 0);
    },[])

    useEffect(()=>{
        setTotalDate(calculateTotalDate(endDate, startDate))
        displayPeriod(startDate, endDate)
    },[startDate,endDate])

    useEffect(() => {}, [feedback, feedbackDetail]);

    useEffect(() => {
        getUserInfo()
            .then((id) =>   { if (id) {
                return Promise.all([getUserNid(id), getUserNdl(id)]);
            }})
    },[id])

    useEffect(() => {
        if (carInfo) {
            setCarSeats(carInfo.seats);
            setCarFuel(carInfo.typeOfFuels);
            setCarPrice(carInfo.price);
            setInsurancePrice(insuranceCalculate(carInfo.price))
            setTotalPrice(calculateTotalPrice(carInfo.price))
        }
    },[carInfo, carAmenities])
    
    useEffect(() => {
        setRentTotal(calculateRentPrice(totalPrice, totalDate))
    },[totalPrice, totalDate])

    // useEffect(() => {
    //     setWallet(userInfo.wallet)
    // },[userInfo])
    
    function handleDate(d) {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDateTime = `${day}/${month}/${year}`;
        return formattedDateTime;
    }

    function getTimeFromDate(d) {
        const date = new Date(d);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
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
            let total = priceInt*0.98;
            priceString = `${total}`;
            return priceString;
        }
    }

    function calculateRentPrice(total, totalDate) {
        let rentTotal = parseInt(total) * parseInt(totalDate);
        console.log(rentTotal);
        return rentTotal
    }

    function calculateTotalDate(enddate, startdate){
        let millisecondsPerDay = 1000 * 60 * 60 * 24;
        let period = enddate - startdate;
        let differenceInDays = Math.ceil(period / millisecondsPerDay);
        // setTotalDate(differenceInDays)
        return differenceInDays
    }

    function calculatePayment(){
        setWallet(prev => prev - rentTotal)
    }

    function handleChange(ranges){
        setDate(ranges.selection)
        const startDateTemp = new Date(startDate);
        const endDateTemp = new Date(endDate);
        const newStartDate = new Date(ranges.selection.startDate);
        const newEndDate = new Date(ranges.selection.endDate);
        startDateTemp.setDate(newStartDate.getDate());
        startDateTemp.setMonth(newStartDate.getMonth());
        endDateTemp.setDate(newEndDate.getDate());
        endDateTemp.setMonth(newEndDate.getMonth());
        startDate.setDate(startDateTemp.getDate());
        startDate.setMonth(startDateTemp.getMonth());
        endDate.setDate(endDateTemp.getDate());
        endDate.setMonth(endDateTemp.getMonth());
        displayPeriod(startDate, endDate);
        setTotalDate(calculateTotalDate(endDate, startDate))
        console.log("rung")
    }    

    function displayPeriod(startDate, endDate){
        const tempStartDate = handleDateTime(startDate);
        const tempEndDate = handleDateTime(endDate);
        const rs = `${tempStartDate} - ${tempEndDate}`;
        setFilterDateTime(rs)
    }
          
    return(
        <div id="car-detail">
            <Header/>
            <div className="body">
                <div className="img-container">
                    {carImages.map((img, index) => (
                        <img key={img.id} src={img.url} alt="" className={`item-${index + 1}`}/>
                    ))}
                </div>
                <div className="car-info">
                    <div className="info">
                        <div className="name">
                            {(carInfo) ? 
                                <p>{carInfo.name}</p>
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
                            <br />
                            <div className="amenity-container">
                                {carAmenities.map((amenity) => (
                                    <div className="box" key={amenity.id}>
                                            <div className="amenity"> 
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
                                            </div>
                                    </div>
                                ))}             
                            </div>
                        </div>
                        <hr/>
                        <div className="description" style={{minHeight: "175px"}}>
                            <br />
                            <div className="titl" style={{fontSize: "1.2em", fontWeight: "500"}}>
                                Mô tả 
                            </div>
                            <br />
                            <p style={{color: "#4F4F4F",}}>{carInfo ? carInfo.description : ""}</p>
                        </div>
                        <br />
                        <hr />
                        <br />
                        <div className="rating-section">
                            <br />
                            <div className="titl" style={{fontSize: "1.2em", fontWeight: "500"}}>
                                Đánh Giá
                            </div>
                            <br />
                            {feedback.map((fb) => (
                                <div key={fb.feedback.id} className="feedback-container" style={{ marginBottom: "20px"}}>
                                    <div style={{ width: "20%", height: "100px", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "solid 1px #ccc" }}>
                                        <div
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "50%",
                                                overflow: "hidden"
                                            }}>
                                            <img src={fb.userImage} alt={fb.userName} style={{ height: '100%', width: 'auto' }} />
                                        </div>
                                    </div>
                                    <div style={{ width: "80%", textAlign: "left", padding: "0 20px" }}>
                                        <div style={{ paddingTop: "10px", fontSize: "20px", fontWeight: "500" }}>{fb.userName}</div>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <Rating value={parseInt(fb.feedback.rating)} precision={0.2} size="small" readOnly />
                                            <div>{handleDate(fb.feedback.feedbackDate)}</div>
                                        </div>
                                        <p style={{ fontSize: "15px", color: "#545454", paddingTop: "5px"}}>{fb.feedback.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="price">
                        <h1>{carInfo.price}K</h1>
                                <div className="period" onClick={handleOpen}>
                                    <div className="book">
                                        <table>
                                            <tr>
                                                <td style={{textAlign: "left", fontWeight: "490"}}>Nhận xe</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign: "left", fontWeight: "490"}}>{handleDate(startDate)}</td>
                                                <td style={{paddingLeft: "10px", fontWeight: "490"}}>{getTimeFromDate(startDate)}</td>
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
                                                <td style={{textAlign: "left", fontWeight: "490"}}>{handleDate(endDate)}</td>
                                                <td style={{paddingLeft: "10px", fontWeight: "490"}}>{getTimeFromDate(endDate)}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <Modal
                                    open={open}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    onClose={handleClose}
                                >
                                    <div 
                                        id="home-datetime-container" 
                                        style={{
                                            width: "60%",
                                            height: "fit-content", 
                                            padding: "25px", 
                                            backgroundColor: "#fff", 
                                            borderRadius: "25px", 
                                            transform: 'translate(30%, 100px)'
                                            }}>
                                        <p style={{fontSize: "22px", fontWeight: "500"}}>Thời gian</p>
                                        <hr style={{width: "100%"}}/>
                                        <p style={{color: "#ccc"}}>*Giới hạn thời gian thuê xe tối đa 30 ngày. Bạn vui lòng điều chỉnh lại thời gian phù hợp</p>
                                        <div className="datetime-modify">
                                            <div className="date-modify">
                                                <DateRange
                                                    ranges={[date]}
                                                    onChange={handleChange}
                                                    minDate={boundDate}
                                                    maxDate={maxDate}
                                                    months={2}
                                                    direction="horizontal"
                                                    locale={locale}
                                                    color="#5fcf86"
                                                    rangeColors="#5fcf86, #469963"
                                                />
                                            </div>
                                            <div className="time-modify" style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Controlled picker"
                                                        views={['hours','minutes']}
                                                        value={dayjs(startDate)}
                                                        sx={{
                                                            width: "40%"
                                                        }}
                                                        onChange={(newValue) => {startDate.setTime(newValue), displayPeriod(startDate, endDate), setTotalDate(calculateTotalDate(endDate, startDate)), console.log(startDate)}}
                                                    />
                                                </LocalizationProvider>
                                                <p style={{fontSize: "30px", padding: "0 10px"}}>-</p>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <TimePicker
                                                        label="Controlled picker"
                                                        views={['hours','minutes']}
                                                        value={dayjs(endDate)}
                                                        sx={{
                                                            width: "40%"
                                                        }}
                                                        onChange={(newValue) => {endDate.setTime(newValue), displayPeriod(startDate, endDate), setTotalDate(calculateTotalDate(endDate, startDate)), console.log(endDate)}}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="conclude" style={{width: "70%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                            <div>
                                                <p>{filterDateTime ? filterDateTime : "--/--/--- --:-- - --/--/---- --:--"}</p>
                                                <p>Số ngày thuê: {totalDate} ngày</p>
                                            </div>
                                            <div 
                                                style={{
                                                    padding: "10px",
                                                    backgroundColor: "#5fcf86",
                                                    color: "#fff",
                                                    borderRadius: "5px",
                                                    cursor: "pointer"
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#5fcf86";
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#469963";
                                                }}
                                                onClick={handleClose}
                                            >Tiếp tục</div>
                                        </div>
                                    </div>
                                </Modal>
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
                            {/* <div>
                                <p style={{fontWeight: "490"}}>Bảo hiểm thuê xe</p>
                                <p style={{fontWeight: "490"}}>{insurancePrice}</p>
                            </div> */}
                        </div>
                        <hr style={{padding: "0 21px"}}/>
                        <div className="total">
                            <div>Tổng cộng</div>
                            <div>{totalPrice}K x {totalDate} ngày</div>
                        </div>
                        <hr/>
                        <div className="voucher" style={{cursor : "pointer"}}>
                            <div>
                                <DiscountIcon style={{height: "16px"}}/><p>Mã khuyến mãi</p>
                            </div>
                            <div><ArrowForwardIosIcon style={{height: "16px"}}/></div>
                        </div>
                        <hr/>
                        <div className="payment">
                            <p>Thành tiền</p>
                            <p>{rentTotal}K</p>
                        </div>
                        {(auth && userInfo) ? (
                            <hr />
                        ) : null }
                        {(auth && userInfo) ? (
                            <div className="wallet">
                                <p>Ví</p>
                                <p>{wallet}K</p>
                            </div>
                        ): null}
                        {auth ?
                            <Popup
                                trigger={
                                    <div 
                                        variant="contained" 
                                        style={{cursor: "pointer", padding: "8px", backgroundColor: "#5fcf86", borderRadius: "5px", fontWeight: "500", textAlign: "center", color: "#fff"}}
                                        onMouseLeave={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                                        onMouseOver={(e) => {e.target.style.backgroundColor = "#469963"; e.target.style.color = "#fff"}}
                                        // onClick={() => {console.log("run")}}
                                    >Chọn xe</div>
                                }
                                modal
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "25px",
                                    padding: "1em 2em 1.5em 2em",
                                    height: "fit-content",
                                    width: "fit-content",
                                }}
                            >
                                {close =>
                                    <div id="payment">
                                        <p style={{fontSize: "22px", fontWeight: "500", paddingBottom: "15px"}}>Xác nhận thanh toán</p>
                                        
                                        <br />
                                        <div className="btn-ctn">
                                            <div 
                                                className="btn"
                                                onMouseLeave={(e) => {e.target.style.backgroundColor = "#fff"}}
                                                onMouseOver={(e) => {e.target.style.backgroundColor = "#ccc"}}
                                                onClick={() => {close()}}
                                            >Hủy</div>
                                            <div 
                                                className="btn"
                                                onClick={() => {addCar(); close()}}
                                                style={{backgroundColor: "#5fcf86", cursor: "pointer"}}
                                                onMouseLeave={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                                                onMouseOver={(e) => {e.target.style.backgroundColor = "#469963", e.target.style.color = "#fff"}}
                                            >Xác nhận</div>
                                        </div>
                                    </div>
                                }
                            </Popup>
                        :
                            <Popup
                                trigger={
                                    <div 
                                        variant="contained" 
                                        style={{cursor: "pointer", padding: "8px", backgroundColor: "#5fcf86", borderRadius: "5px", fontWeight: "500", textAlign: "center", color: "#fff"}}
                                        onMouseLeave={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                                        onMouseOver={(e) => {e.target.style.backgroundColor = "#469963"; e.target.style.color = "#fff"}}
                                    >Chọn xe</div>
                                }
                                position="center"
                                modal
                            >
                                {close => (
                                    <div className="login-popup">
                                        <LoginForm/>
                                    </div>
                                )}
                        </Popup>
                        }
                        <Modal
                            open={openMsg}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            onClose={handleCloseMsg}
                            style={{display: "flex", justifyContent:"center", paddingTop: "50px"}}
                        >
                            <div 
                                style={{
                                    backgroundColor: "#fff",
                                    height: "fit-content",
                                    padding:"20px",
                                    fontSize: "26px", 
                                    borderRadius: "25px"
                                }}
                            >
                                <div style={{margin: "20px"}}>
                                    {msg}
                                </div>
                                <div 
                                    style={{width:"100%", textAlign:"center", padding:"10px 0", backgroundColor: "#5fcf86", color: "#fff", borderRadius: "15px", cursor: "pointer"}}
                                    onMouseLeave={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                                    onMouseOver={(e) => {e.target.style.backgroundColor = "#469963"; e.target.style.color = "#fff"}}
                                    onClick={handleCloseMsg}
                                >Ok</div>
                            </div>
                        </Modal>
                    </div>
                </div>
                <CartButon/>
            </div>
            <Footer/>
        </div>
    )
}

//
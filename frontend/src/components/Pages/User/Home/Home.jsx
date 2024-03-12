import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import Card from "../../../Items/Card/Card";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RentImg from "../../../../images/thue_xe_oto_tu_lai_di_du_lich_gia_re.fde3ac82.png"
import BannerIMG from "../../../../images/Banner.jpg"
import { useAuth } from '../../../../Context/AuthProvider.jsx';
import Popup from "reactjs-popup";
import Cookies from "js-cookie";
import axios from "axios";
import "./Home.css"
import { func } from "prop-types";

export default function Home() {

  const apiKey = "AIzaSyCjiKvKTIr5FA0KkApXb5FyP0WkFUNxiWo"

  const navigate = useNavigate();

  const { auth, id, role  } = useAuth();

  const [ carList, setCarList ] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null)
  const [error, setError] = useState(null);

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');

  const [endDateTime, endStartDateTime] = useState(new Date());
  const [endDate, endStartDate] = useState('');
  const [endTime, endStartTime] = useState('');

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  async function fetchCarList(){
    try {
        const response = await axios.get('http://localhost:4000/car/recommend?items=8');
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
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  async function getAddress(){
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const formattedAddress = response.data.results[0]?.formatted_address;
          setAddress(formattedAddress);
        } catch (error) {
          setError('Error fetching address');
        }
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      }
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCarList();
    console.log(handleDate(currentDateTime))
    const a = "3-12-2024 15:21:13";
    const b = new Date(a)
    const c = new Date()
    console.log(b)
    console.log(c)
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
  },[])

  useEffect(() => {
    if(auth) console.log("Login:", auth);
    const token = Cookies.get('token')
    console.log(token)
    console.log(id)
    console.log(role)
  }, [auth, id]);
  
  useEffect(() => {
    console.log(location)
    console.log(address)
  },[carList,location,address])

  function handleDate(d){
    const date = new Date(d)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }

  function combineDateTime(date, time){
    const dateTimeString = `${date} ${time}`;
    const combineDT = new DateTime(dateTimeString);

  }

  return (
    <div id="home">
        <Header/>
        <div id="body">
          <div className="banner-section">
            <img src={BannerIMG} className="banner-image"/> 
            <form className="search-option">
              <div className="option">
                <div className="sub-option location">
                  <table style={{width: "100%"}}>
                    <tr style={{color:""}}>
                      <td><LocationOnIcon/></td>
                      <td style={{textAlign: "left"}}>Địa điểm</td>
                    </tr>
                    <tr>
                      <td></td>
                        {/* <Popup
                          trigger={*/}
                            <td style={{cursor: "pointer", overflow: "hidden"}}>
                              <p style={{textAlign: "left", fontWeight: "500"}}>{address ? address : "Hồ Chí Minh"}</p>
                            </td>
                        {/*}  }
                          contentStyle={{
                            height: "fit-content", 
                            width: "60%",
                            backgroundColor: "white",
                            padding: "1em 2em 1.5em 2em",
                            borderRadius: "15px"
                          }}
                          modal
                        >
                          <div id="home-adr-container">
                            <h3>Địa điểm</h3>
                            <hr />

                          </div>
                        </Popup> */}
                    </tr>
                  </table>
                </div>
                <div class="vertical-line"></div>
                <div className="sub-option period">
                <table style={{width: "100%"}}>
                    <tr>
                      <td><CalendarMonthIcon/></td>
                      <td style={{textAlign: "left"}}>Thời gian thuê</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><TextField select fullWidth variant="standard"/></td>
                    </tr>
                  </table>
                </div>
                <div className="search-button">
                  <Button 
                    variant="outlined" 
                    size="large" 
                    style={{height: "40%",
                            width: "60%", 
                            borderColor: "#00BF54", 
                            color: "#00BF54", 
                            fontWeight: "bold"
                          }}
                    onClick={()=>navigate("/car/carlist")}>
                            Tìm xe
                            </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="membership-section">
            <p>Mã giảm giá</p>
            <div className="membership-container">
              <div className="membership mem1"></div>
              <div className="membership mem2"></div>
            </div>
          </div>
          <div className="car-section">
            <p>Xe Dành Cho Bạn</p>
            <div className="car-container">
              {carList.map((car) => (
                <Card key={car.id} id={car.id} year={car.year} price={car.price} description={car.description} image={car.imgUrl} typeId={car.carTypeId} />
              ))}
            </div>
          </div>
          <div className="explorer-section">
            <div className="explorer-container">
              <div className="content">
                <p>Bạn muốn cho thuê xe?</p>
                <div className="options">
                  <Button variant="outlined" style={{height: "80px",width: "200px", borderColor: "#00BF54", color: "#00BF54", fontWeight: "bold", fontSize: "20px"}}>Tìm hiểu thêm</Button>
                  <Button variant="contained" style={{height: "80px",width: "200px", color: "#ffffff", fontWeight: "bold", fontSize: "20px", backgroundColor: "#00BF54"}}>Đăng ký xe</Button>
                </div>
              </div>
              <div className="image">
                <img src={RentImg}/>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  )
}



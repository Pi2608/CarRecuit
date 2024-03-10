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
import Cookies from "js-cookie";
import axios from "axios";
import "./Home.css"

export default function Home() {

  const navigate = useNavigate();
  const { auth, id, role  } = useAuth();

  const [ carList, setCarList ] = useState([]);

  const fetchCarList = async () => {
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
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  };

  const getRandomItems = (arr, count) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCarList();
  },[])
  
  useEffect(() => {
    if(auth) console.log("Login:", auth);
    const token = Cookies.get('token')
    console.log(token)
    console.log(id)
    console.log(role)
  }, [auth]);

  useEffect(() => {

  },[carList])

  return (
    <div id="home">
        <Header/>
        <div id="body">
          <div className="banner-section">
            <img src={BannerIMG} className="banner-image"/> 
            <div className="search-option">
              <div className="option">
                <div className="sub-option location">
                  <table style={{width: "100%"}}>
                    <tr style={{color:""}}>
                      <td><LocationOnIcon/></td>
                      <td style={{textAlign: "left"}}>Địa điểm</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><TextField select fullWidth variant="standard"/></td>
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
            </div>
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
              {getRandomItems(carList, 8).map((car) => (
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



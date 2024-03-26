import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import Card from "../../../Items/Card/Card";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Button from '@mui/material/Button';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import locale from 'date-fns/locale/vi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from "dayjs";
import Modal from '@mui/material/Modal';
import RentImg from "../../../../images/thue_xe_oto_tu_lai_di_du_lich_gia_re.fde3ac82.png"
import BannerIMG from "../../../../images/Banner.jpg"
import { useAuth } from '../../../../Context/AuthProvider.jsx';
// import Cookies from "js-cookie";
import axios from "axios";
import "./Home.css"
import { func } from "prop-types";

export default function Home() {

  const apiKey = "AIzaSyCjiKvKTIr5FA0KkApXb5FyP0WkFUNxiWo"

  const navigate = useNavigate();

  const { auth, id, roleUserId  } = useAuth();

  const [ open, setOpen ] = useState(false);

  const [ carList, setCarList ] = useState([]);
  const [ location, setLocation ] = useState(null);
  const [ address, setAddress ] = useState(null)
  const [ error, setError ] = useState(null);

  const [ boundDate, setBoundDate ] = useState(new Date());
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, endStartDate ] = useState(new Date());
  const [ maxDate, setMaxDate ] = useState(new Date())
  
  const [filterDateTime,setFilterDateTime] = useState("");
  
  const [ date, setDate ] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

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
  }    

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
    displayPeriod();
    var today = new Date();
    boundDate.setDate(today.getDate() + 3)
    maxDate.setMonth(boundDate.getMonth() + 1)
    startDate.setDate(boundDate.getDate() )
    startDate.setHours(7, 0, 0, 0)
    endDate.setDate(boundDate.getDate() + 1)
    endDate.setHours(7, 0, 0, 0);
    displayPeriod(startDate, endDate);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    } else {
      getAddress()
    }
  },[])

  useEffect(() => {}, [auth]);
  
  useEffect(() => {},[id, roleUserId])
  
  useEffect(() => {
    console.log(location)
    console.log(address)
  },[carList,location,address])

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

  function displayPeriod(startDate, endDate){
    const tempStartDate = handleDateTime(startDate);
    const tempEndDate = handleDateTime(endDate);
    const rs = `${tempStartDate} - ${tempEndDate}`;
    setFilterDateTime(rs)
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
                      <td style={{display: "flex", justifyContent: "right"}}><LocationOnIcon style={{height: "20px"}}/></td>
                      <td style={{textAlign: "left", fontSize: "20px", cursor: "pointer"}}>Địa điểm</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td style={{cursor: "pointer", overflow: "hidden"}}>
                        <p style={{textAlign: "left", fontWeight: "500", fontSize: "18px"}}>Hồ Chí Minh</p>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="vertical-line"></div>
                <div className="sub-option period" onClick={handleOpen}>
                    <table style={{width: "100%"}}>
                      <tr>
                        <td><CalendarMonthIcon style={{height: "20px"}}/></td>
                        <td style={{textAlign: "left", fontSize: "20px", cursor: "pointer"}}>Thời gian thuê</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{cursor: "pointer"}}>
                          <p style={{textAlign: "left", fontWeight: "500", fontSize: "17px"}}>{filterDateTime}</p>
                        </td>
                      </tr>
                    </table>
                </div>
                <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
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
                                          onChange={(newValue) => {startDate.setTime(newValue), displayPeriod(startDate, endDate), console.log(startDate)}}
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
                                          onChange={(newValue) => {endDate.setTime(newValue), displayPeriod(startDate, endDate), console.log(endDate)}}
                                      />
                                  </LocalizationProvider>
                              </div>
                          </div>
                          <br />
                          <div className="conclude" style={{width: "70%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                              <div>
                                  <p>{filterDateTime ? filterDateTime : "--/--/--- --:-- - --/--/---- --:--"}</p>
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
          {/* <div className="membership-section">
            <p>Mã giảm giá</p>
            <div className="membership-container">
              <div className="membership mem1"></div>
              <div className="membership mem2"></div>
            </div>
          </div> */}
          <div className="car-section">
            <p>Xe Dành Cho Bạn</p>
            <div className="car-container">
              {carList.map((car) => (
                <Card key={car.id} id={car.id} name={car.name} price={car.price} description={car.description} image={car.imgUrl} ldescription={car.ldescription  } typeId={car.carTypeId}/>
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



import React from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import BannerIMG from "../../../../images/Banner.jpg"
import "./Home.css"

export default function Home() {
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
                      <td> Địa điểm</td>
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
                      <td> Thời gian thuê</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td><TextField select fullWidth variant="standard"/></td>
                    </tr>
                  </table>
                </div>
                <div className="search-button">
                  <Button variant="outlined" size="large" style={{height: "40%",width: "60%", borderColor: "#00BF54", color: "#00BF54", fontWeight: "bold"}}>Tìm xe</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="membership-section">
            <p>Membership</p>
            <div className="membership-container">
              <div className="membership mem1"></div>
              <div className="membership mem2"></div>
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  )
}



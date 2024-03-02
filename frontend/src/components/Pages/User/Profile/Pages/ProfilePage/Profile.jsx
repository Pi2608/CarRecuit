import React, { useEffect } from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import Sidebar from "../../Profile items/Sidebar/Sidebar";
import Infomation from "../../Profile items/Content items/Infomation/Infomation";
import "./Profile.css"

export default function Profile() {

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return(
        <div id="profile">
            <Header/>
            <div className="body">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content-account">
                    <Infomation/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
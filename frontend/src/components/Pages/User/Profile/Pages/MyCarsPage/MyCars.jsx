import React, { useEffect } from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import CarManage from "../../Profile items/Content items/MyCars/CarManage";
import MCSidebar from "../../Profile items/Sidebar/MCSideBar";
import "./MyCars.css"

export default function MyCars(){

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return(
        <div id="mycar">
            <Header />
            <div className="body">
                <div className="sidebar">
                    <MCSidebar />
                </div>
                <div className="content">
                    <CarManage />
                </div>
            </div>
            <Footer />
        </div>
    )
}
import React, { useEffect } from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import UpComingRequest from "../../Profile items/Content items/UpComingRequest/UpComingRequest";
import MCSidebar from "../../Profile items/Sidebar/MCSideBar";
import "./UpComing.css"

export default function UpComing(){

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return(
        <div id="upcomingcar">
            <Header />
            <div className="body">
                <div className="sidebar">
                    <MCSidebar />
                </div>
                <div className="content">
                    <UpComingRequest />
                </div>
            </div>
            <Footer />
        </div>
    )
}
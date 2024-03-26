import React, { useEffect } from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import PendingCarsList from "../../Profile items/Content items/PendingCars/PendingCarsList";
import MCSidebar from "../../Profile items/Sidebar/MCSideBar";
import "./PendingCars.css"

export default function PendingCars(){

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
                    <PendingCarsList />
                </div>
            </div>
            <Footer />
        </div>
    )
}
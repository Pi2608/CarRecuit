import React from 'react';
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import Sidebar from "../../Profile items/Sidebar/Sidebar";
import MyTrips from '../../Profile items/Content items/MyTrips/MyTrips';
import "./Trips.css"

export default function Trips(){
    return (
        <div id="trip">
            <Header/>
            <div className="body">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content-account">
                    <MyTrips/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
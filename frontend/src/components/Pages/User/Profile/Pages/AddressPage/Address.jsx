import React from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import Sidebar from "../../Profile items/Sidebar/Sidebar";
import MyAddress from "../../Profile items/Content items/MyAddress/MyAddress";
import "./Address.css"

export default function Address() {
    return(
        <div id="address">
            <Header/>
            <div className="body">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content-account">
                    <MyAddress/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
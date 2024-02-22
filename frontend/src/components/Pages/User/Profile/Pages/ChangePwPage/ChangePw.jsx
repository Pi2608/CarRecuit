import React from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import Sidebar from "../../Profile items/Sidebar/Sidebar";
import ResetPw from "../../Profile items/Content items/ResetPwPage/ResetPw";
import "./ChangePw.css"

export default function Profile() {
    return(
        <div id="profile">
            <Header/>
            <div className="body">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="content-account">
                    <ResetPw/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
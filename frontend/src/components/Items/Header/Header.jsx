import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {

    const navigate = useNavigate()

    return(
        <div id="header">
            <div className="header-container">
                <div className="logo-container" onClick={()=>navigate("/")}>
                    <h1>CarFlex</h1>
                </div>
                <div className="menu-container">
                    <a className="menu-item">About CarFlex</a>
                    <a className="menu-item">Become a partner</a>
                    <div class="vertical-line"></div>
                    <a className="menu-item">User</a>
                </div>
            </div>
        </div>
    )
}

export default Header
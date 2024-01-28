import React from "react";
import "./Header.css";

function Header() {
    return(
        <div id="header">
            <div className="header-container">
                <div className="logo-container">
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
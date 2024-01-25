import React from "react";
import "./Footer.css";

function Footer() {
    return(
        <div id="footer">
            <div className="footer-about">
                <div className="footer-info">
                    <div className="logo">LOGO</div>
                </div>
                <div className="footer-item">
                <div className="item">
                        <p className="main">Chính sách</p>
                        <div className="sub-item">
                            <p>Chính sách 1</p>
                            <p>Chính sách 2</p>
                            <p>Chính sách 3</p>
                            <p>Chính sách 4</p>
                        </div>
                    </div>
                    <div className="item">
                        <p className="main">Tìm hiểu thêm</p>
                        <div className="sub-item">
                            <p>Hướng dẫn chung</p>
                            <p>Hướng dẫn đặt xe</p>
                            <p>Hướng dẫn thanh toán</p>
                        </div>
                    </div>
                    <div className="item">
                        <p className="main">Phương thức thanh toán</p>
                        <div className="sub-item">
                            <p>Chính sách 1</p>
                            <p>Chính sách 2</p>
                            <p>Chính sách 3</p>
                            <p>Chính sách 4</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
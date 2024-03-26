import React from "react";
import logo from "../../../images/carFlexLogo.jpg"
import Paypal from "../../../icons/PayPal.jpg"
import VNPay from "../../../icons/Vietcombankicon.jpg"
import "./Footer.css";

function Footer() {
    return(
        <div id="footer">
            <div className="footer-about">
                <div className="footer-info">
                    <img src={logo}/>
                    <div className="logo">LOGO</div>
                </div>
                <div className="footer-item">
                <div className="item">
                        <p className="main">Chính sách</p>
                        <br />
                        <div className="sub-item">
                            <p>Chính sách và quy định</p>
                            <p>Quy chế hoạt động</p>
                            <p>Bảo mật thông tin</p>
                            <p>Giải quyết tranh chấp</p>
                        </div>
                    </div>
                    <div className="item">
                        <p className="main">Tìm hiểu thêm</p>
                        <br />
                        <div className="sub-item">
                            <p>Hướng dẫn chung</p>
                            <p>Hướng dẫn đặt xe</p>
                            <p>Hướng dẫn thanh toán</p>
                            <p>Giải quyết tranh chấp</p>
                        </div>
                    </div>
                    <div className="item">
                        <p className="main">Phương thức thanh toán</p>
                        <br />
                        <table>
                            <tr className="payment-method">
                                <td><img src={Paypal}/></td>
                                <td><p>PayPal</p></td>
                            </tr>
                            <tr className="payment-method">
                                <td><img src={VNPay}/></td>
                                <td><p>VNPay</p></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
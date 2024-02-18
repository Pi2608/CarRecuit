import React,{ useState } from "react";
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import "./Infomation.css"

export default function Infomation() {

    const [userName, setUserName] = useState('Pi26');
    const [userPoint, setUserPoint] = useState(0);
    const [userCredit, setUserCredit] = useState('0.0 đ');

    return (
        <div id="info">
            <div className="container user-profile">
                <div className="title">
                    <h2>Thông tin tài khoản</h2>
                    <div><WorkOutlineOutlinedIcon style={{color: "#9aff6f", height: "30px"}}/><h2>0 </h2> chuyến</div>
                </div>
                <div className="content">
                    <div className="avatar-box">
                        <div className="avatar-container">
                            <img src="" alt="" />
                        </div>
                        <div className="ctn">
                            <p className="user-name">{userName}</p>
                            <div className="box point">
                                    <div><StarsIcon style={{height: "20px", color: "yellow"}}/></div>
                                    <p>{userPoint} điểm</p>
                            </div>
                            <div className="box credit">
                                    <div><AttachMoneyIcon style={{height: "20px", color: "green"}}/></div>
                                    <p>{userCredit}</p>
                            </div>
                        </div>
                    </div>
                    <div className="info-user">
                        <div className="info-box">
                            <div className="info-box-item">
                                <p>Ngày sinh</p>
                                <p>--/--/----</p>
                            </div>
                            <div className="info-box-item">
                                <p>Giới tính</p>
                                <p>Nam</p>
                            </div>
                        </div>
                        <div className="info-desc">
                            <div className="info-desc-item">
                                <p>Số điện thoại</p>
                                <p></p>
                            </div>
                            <div className="info-desc-item">
                                <p>Email</p>
                                <p></p>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

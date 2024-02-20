import React,{ useState } from "react";
import TextField from '@mui/material/TextField';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import "./Infomation.css"

export default function Infomation() {

    const [userName, setUserName] = useState('Pi26');
    const [userPoint, setUserPoint] = useState(0);
    const [userCredit, setUserCredit] = useState('0.0 đ');
    const [userPhoneNumber, setUserPhoneNumber] = useState('0867545781');
    const [userEmail, setUserEmail] = useState('datldpse173640@fpt.edu.vn');

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
                                <p className="main">--/--/----</p>
                            </div>
                            <div className="info-box-item">
                                <p>Giới tính</p>
                                <p className="main">Nam</p>
                            </div>
                        </div>
                        <div className="info-desc">
                            <div className="info-desc-item">
                                <p>Số điện thoại</p>
                                <p className="main">{userPhoneNumber}</p>
                            </div>
                            <div className="info-desc-item">
                                <p>Email</p>
                                <p className="main">{userEmail}</p>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="title">
                    <div>
                        <h2 style={{paddingRight: "8px"}}>Giấy phép lái xe</h2>
                        <div style={{fontSize: "10px", padding:'8px'}}>
                            <div style={{backgroundColor: "#FF6A6A", borderRadius:"8px", padding: "3px"}}>
                                <HighlightOffOutlinedIcon style={{height: "10px", width: "12px", color:"red"}}/>
                                <p>Chưa xác thực</p>
                            </div>
                        </div>
                    </div>
                    <div>Chỉnh sửa</div>
                </div>
                <div className="content">
                    <div className="info-license">
                        <h3>Thông tin chung</h3>
                        <h4 style={{color: "#767676"}}>Số GPLX</h4>                        
                        <TextField 
                            placeholder="Số GPLX"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                        <h4 style={{color: "#767676"}}>Họ và tên</h4>
                        <TextField 
                            placeholder="Họ và tên"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                        <h4 style={{color: "#767676"}}>Ngày sinh</h4>
                        <TextField 
                            placeholder="--/--/----"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                    </div>
                    <div className="info-license">
                        <h3>Hình ảnh</h3>
                        <label className="info-license-upload">

                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

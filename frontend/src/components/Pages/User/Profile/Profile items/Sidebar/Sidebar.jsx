import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../Context/AuthProvider.jsx";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import "./Sidebar.css"

export default function Sidebar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        console.log("User logged out");
    };

    return (
        <div id="sidebar">
            <h1>Xin chào user</h1>
            <div className="sidebar-item" onClick={() => navigate("/user/profile")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><PermIdentityOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Tài khoản của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/user/mycars")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><DirectionsCarFilledOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Xe của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/user/mytrips")}>  
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><WorkOutlineOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Chuyến của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/user/myaddress")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><RoomOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Địa chỉ của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/user/resetpw")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><LockOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Đổi mật khẩu</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => {
                                                            handleLogout()
                                                            navigate("/")
                                                            }}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><LogoutOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Đăng xuất</p> </td>
                </table>
            </div>
            <div className="sidebar-item">
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><DeleteOutlineOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Yêu cầu xóa tài khoản</p></td>
                </table>
            </div>
        </div>
    )
}
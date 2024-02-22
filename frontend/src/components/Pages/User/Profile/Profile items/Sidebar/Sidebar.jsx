import React from "react";
import { useNavigate } from "react-router-dom";
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

    return (
        <div id="sidebar">
            <h1>Xin chào user</h1>
            <div className="sidebar-item" onClick={() => navigate("/profile")}>
                <table>
                    <td><PermIdentityOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Tài khoản của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/")}>
                <table>
                    <td><DirectionsCarFilledOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Xe của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/mytrips")}>  

                <table>
                    <td><WorkOutlineOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Chuyến của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/myaddress")}>
                <table>
                    <td><RoomOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Địa chỉ của tôi</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/resetpw")}>
                <table>
                    <td><LockOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Đổi mật khẩu</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/")}>
                <table>
                    <td><LogoutOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Đăng xuất</p> </td>
                </table>
            </div>
            <div className="sidebar-item">
                <table>
                    <td><DeleteOutlineOutlinedIcon style={{height: "18px"}}/></td>
                    <td><p>Yêu cầu xóa tài khoản</p></td>
                </table>
            </div>
        </div>
    )
}
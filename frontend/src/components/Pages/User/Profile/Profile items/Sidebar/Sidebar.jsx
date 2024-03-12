import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../../Context/AuthProvider.jsx";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
// import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from "axios";
import Popup from "reactjs-popup";
import "./Sidebar.css"
import { func } from "prop-types";

export default function Sidebar() {

    const navigate = useNavigate();

    const { id, logout } = useAuth();

    const [deleteMsg, setDeleteMsg] = useState('');

    const handleLogout = () => {
        logout();
        console.log("User logged out");
    };

    async function deleteUser(){
        try {
            const response = await axios.put(`http://localhost:4000/user/delete/${id}`)
            const data = response.data;
        } catch (error) {
            console.error("Error deleting user: " + error.message) 
        }
    }

    function handleDelete(){
        deleteUser()
            .then(() => handleLogout())
            .catch((error) => console.error("Error handling account deletion:", error));
    }

    return (
        <div id="sidebar">
            <h1>Xin chào bạn!</h1>
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
            {/* <div className="sidebar-item" onClick={() => navigate("/user/myaddress")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><RoomOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Địa chỉ của tôi</p></td>
                </table>
            </div> */}
            <div className="sidebar-item" onClick={() => navigate("/user/resetpw")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><LockOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Đổi mật khẩu</p></td>
                </table>
            </div>
            <Popup
                className="logout-popup"
                trigger={
                    <div className="sidebar-item">
                        <table style={{display: "flex", alignItems: "center"}}>
                            <td style={{position: "relative", top: "2px"}}><LogoutOutlinedIcon style={{height: "24px"}}/></td>
                            <td style={{paddingLeft: "4px"}}><p>Đăng xuất</p></td>
                        </table>
                    </div>
                }
                modal
                position="top"
                contentStyle={{
                                height: "fit-content", 
                                width: "fit-content",
                                backgroundColor: "white",
                                padding: "1em 2em 1.5em 2em",
                                borderRadius: "15px"
                            }}
            >
                {close =>(
                    <div id="logout-container">
                        <h1>Đăng xuất</h1>
                        <br />
                        <p>Bạn chắc chắn muốn đăng xuất không?</p>
                        <br />
                        <div className="btn-ctn">
                            <div className="ccl-btn btn" onClick={close}>Hủy</div>
                            <div className="apt-btn btn" onClick={() => {handleLogout();navigate("/")}}>Đăng xuất</div>
                        </div>
                    </div>
                )}
            </Popup>
            <Popup
                trigger={
                    <div className="sidebar-item">
                        <table style={{display: "flex", alignItems: "center"}}>
                            <td style={{position: "relative", top: "2px"}}><DeleteOutlineOutlinedIcon style={{height: "24px"}}/></td>
                            <td style={{paddingLeft: "4px"}}><p>Yêu cầu xóa tài khoản</p></td>
                        </table>
                    </div>
                }
                modal
                position="top"
                contentStyle={{
                                height: "fit-content", 
                                width: "fit-content",
                                backgroundColor: "white",
                                padding: "1em 2em 1.5em 2em",
                                borderRadius: "15px"
                            }}
            >
                {close =>
                    <div id="delete-account-container">
                    <h1>Xoá tài khoản</h1>
                    <br />
                    <p>Bạn chắc chắn muốn xóa tài khoản?</p>
                    <br />
                    <div className="btn-ctn">
                        <div className="ccl-btn btn" onClick={close}>Hủy</div>
                        <div className="apt-btn btn" onClick={() => {handleDelete(); navigate("/")}}>Tiếp tục</div>
                    </div>
                </div>
                }
            </Popup>
        </div>
    )
}
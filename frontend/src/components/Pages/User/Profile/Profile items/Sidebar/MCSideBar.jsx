import React from "react";
import { useNavigate } from "react-router-dom";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import "./Sidebar.css"

export default function MCSidebar(){

    const navigate = useNavigate();

    return (
        <div id="sidebar" style={{width: "300px"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h1>Xe của tôi</h1>
                <div onClick={() => navigate("/user/profile")} style={{border: "1px solid #ccc", display: "flex", alignItems: "center", borderRadius: "5px", cursor: "pointer"}}>
                    <ArrowBackIosNewIcon style={{padding: "0.2em", color: "#ccc"}}/>
                </div>
            </div>
            <div className="sidebar-item" onClick={() => navigate("/user/mycars")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><DirectionsCarFilledOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Danh sách xe</p></td>
                </table>
            </div> 
            <div className="sidebar-item" onClick={() => navigate("/user/pendingcars")}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><PendingActionsOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Danh sách xe đang chờ</p></td>
                </table>
            </div>
            <div className="sidebar-item" onClick={() => {}}>
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><PlaylistAddCheckOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Theo dõi yêu cầu</p></td>
                </table>
            </div>
        </div>
    )
}
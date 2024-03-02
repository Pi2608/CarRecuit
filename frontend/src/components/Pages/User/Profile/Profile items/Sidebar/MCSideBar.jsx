import React from "react";
import { useNavigate } from "react-router-dom";
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import "./Sidebar.css"

export default function MCSidebar(){

    const navigate = useNavigate();

    return (
        <div id="sidebar">
            <h1>Xe của tôi</h1>
            <div className="sidebar-item">
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><DirectionsCarFilledOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Danh sách xe</p></td>
                </table>
            </div>
            <div className="sidebar-item">
                <table style={{display: "flex", alignItems: "center"}}>
                    <td style={{position: "relative", top: "2px"}}><DirectionsCarFilledOutlinedIcon style={{height: "24px"}}/></td>
                    <td style={{paddingLeft: "4px"}}><p>Danh sách xe đang chờ</p></td>
                </table>
            </div>
        </div>
    )
}
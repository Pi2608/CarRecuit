import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Popup from 'reactjs-popup'
import "./CarManage.css"

export default function CarManage(){

    const navigate = useNavigate()

    return(
        <div id="carmanage">
            <div className="container">
                <div className="head">
                    <h1>Danh sách xe</h1>
                    <div className="rgt-btn" onClick={()=>navigate("/carrregister")}><AddIcon />Đăng ký xe</div>
                </div>
                <div className="car-list">
                    <table style={{width: "100%"}}>
                        <th className='tbl' style={{width: "140px"}}></th>
                        <th className='tbl'>Hãng và loại xe</th>
                        <th className='tbl'>Số chỗ</th>
                        <th className='tbl'>Giá</th>
                        <th className='tbl'>Số chuyến</th>
                        <th className='tbl'>Trạng thái</th>

                        <Popup
                            trigger={
                                <tr>
                                    <td className='tbl' style={{display: "flex", justifyContent: "center", width: "140px"}}>
                                        <div className="img-container">
                                            <div className="img" style={{backgroundColor: "red", height: "100%", width: "auto", borderRadius: "10px     "}}></div>
                                        </div>
                                    </td>
                                    <td className='tbl'>Honda j đó 22</td>
                                    <td className='tbl'>4</td>
                                    <td className='tbl'>630K</td>
                                    <td className='tbl'>20</td>
                                    <td className='tbl'>Đang hoạt động</td>
                                </tr>
                            }
                            position="center"
                        >
                            {(close)=>
                            <div className="car-info-container">
                                <h1>Honda j đó 22</h1>
                            </div>
                            }
                        </Popup>
                    </table>
                </div>
            </div>
        </div>
    )
}
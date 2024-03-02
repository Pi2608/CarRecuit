import React,{ useState, useEffect, useRef } from "react";
import TextField from '@mui/material/TextField';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import StarsIcon from '@mui/icons-material/Stars';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import "./Infomation.css"

export default function Infomation() {

    const fileInputRef = useRef(null);
    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [selectedFile3, setSelectedFile3] = useState(null);
    const [userName, setUserName] = useState('Pi26');
    const [userPoint, setUserPoint] = useState(0);
    const [userCredit, setUserCredit] = useState('0.0 đ');
    const [userPhoneNumber, setUserPhoneNumber] = useState('0867545781');
    const [userEmail, setUserEmail] = useState('datldpse173640@fpt.edu.vn');

    useEffect(() => {
        window.scrollTo(0,0)
    },[])

    
    const handleClick = () => {
        fileInputRef.current.click();
    };
    
    const handleFileChange1 = (event) => {
        try {
          const file = event.target.files[0];
          if (!file) {
            throw new Error("No file selected");
          }
          console.log("File selected:", file.name);
          setSelectedFile1(file);
        } catch (error) {
          console.error("Error:", error.message);
        }
    };

    const handleFileChange2 = (event) => {
        try {
          const file = event.target.files[0];
          if (!file) {
            throw new Error("No file selected");
          }
          console.log("File selected:", file.name);
          setSelectedFile2(file);
          setFileUploadSuccess(true);
        } catch (error) {
          console.error("Error:", error.message);
          setFileUploadSuccess(false);
        }
    };

    const handleFileChange3 = (event) => {
        try {
          const file = event.target.files[0];
          if (!file) {
            throw new Error("No file selected");
          }
          console.log("File selected:", file.name);
          setSelectedFile3(file);
        } catch (error) {
          console.error("Error:", error.message);
        }
    };

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
                        <h2>CCCD/CMND</h2>
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
                    <div className="info-id-card">
                    <h3>Thông tin chung</h3>
                        <h4 style={{color: "#767676"}}>Số CCCD/CMND</h4>                        
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
                            <h4 style={{color: "#767676"}}>Quê quán</h4>
                            <TextField 
                                placeholder="Quê quán"
                                size="small"
                                sx={{
                                    width: "400px",
                                }}
                                />
                            
                        <h4 style={{color: "#767676"}}>Nơi thường trú</h4>
                        <TextField 
                            placeholder="Nơi thường trú"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                        
                        <h4 style={{color: "#767676"}}>Ngày cấp</h4>
                        <TextField 
                            placeholder="--/--/----"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                        
                        <h4 style={{color: "#767676"}}>Nơi cấp</h4>
                        <TextField 
                            placeholder="Nơi cấp"
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            />
                    </div>
                    <div className="info-id-card">
                        <h3>Hình ảnh</h3>
                        <p>Mặt trước:</p>
                        {selectedFile1 ? (
                            <div className="img-container">
                                <label htmlFor="input-file1" className="info-license-upload" style={{maxWidth:"100%", maxHeight:"240px", overflow: "hidden"}}>
                                    <img src={URL.createObjectURL(selectedFile1)} style={{width: "100%", height: "auto"}} className="uploaded-image"/>
                                    <button
                                        id="upload-ndl"
                                        type="button"
                                        onClick={() => {
                                        handleClick();
                                        }}
                                        style={{ display: "none" }}
                                    >
                                        Thêm ảnh
                                    </button>
                                    <input
                                        id="input-file1"
                                        type="file"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        accept=".png, .jpg"
                                        onChange={handleFileChange1} 
                                    />
                                </label>
                            </div>
                        ) : (
                            <label htmlFor="input-file1" className="info-license-upload">
                                <CameraAltOutlinedIcon fontSize="large" />
                                <button
                                    id="upload-ndl"
                                    type="button"
                                    onClick={() => {
                                    handleClick();
                                    }}
                                    style={{ display: "none" }}
                                >
                                    Thêm ảnh
                                </button>
                                <input
                                    id="input-file1"
                                    type="file"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    accept=".png, .jpg"
                                    onChange={handleFileChange1} 
                                />
                            </label>
                        )}
                        <p>Mặt sau:</p>
                        {selectedFile2 ? (
                            <div className="img-container">
                                <label htmlFor="input-file2" className="info-license-upload" style={{maxWidth:"100%", maxHeight:"240px", overflow: "hidden"}}>
                                    <img src={URL.createObjectURL(selectedFile2)} style={{width: "100%", height: "auto"}} className="uploaded-image"/>
                                    <button
                                        id="upload-ndl"
                                        type="button"
                                        onClick={() => {
                                        handleClick();
                                        }}
                                        style={{ display: "none" }}
                                    >
                                        Thêm ảnh
                                    </button>
                                    <input
                                        id="input-file2"
                                        type="file"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        accept=".png, .jpg"
                                        onChange={handleFileChange2} 
                                    />
                                </label>
                            </div>
                        ) : (
                            <label htmlFor="input-file2" className="info-license-upload">
                                <CameraAltOutlinedIcon fontSize="large" />
                                <button
                                    id="upload-ndl"
                                    type="button"
                                    onClick={() => {
                                    handleClick();
                                    }}
                                    style={{ display: "none" }}
                                >
                                    Thêm ảnh
                                </button>
                                <input
                                    id="input-file2"
                                    type="file"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    accept=".png, .jpg"
                                    onChange={handleFileChange2} 
                                />
                            </label>
                        )}
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
                        {selectedFile3 ? (
                            <div className="img-container">
                                <label htmlFor="input-file3" className="info-license-upload" style={{maxWidth:"100%", maxHeight:"240px", overflow: "hidden"}}>
                                    <img src={URL.createObjectURL(selectedFile3)} style={{width: "100%", height: "auto"}} className="uploaded-image"/>
                                    <button
                                        id="upload-ndl"
                                        type="button"
                                        onClick={() => {
                                        handleClick();
                                        }}
                                        style={{ display: "none" }}
                                    >
                                        Thêm ảnh
                                    </button>
                                    <input
                                        id="input-file3"
                                        type="file"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        accept=".png, .jpg"
                                        onChange={handleFileChange3} 
                                    />
                                </label>
                            </div>
                        ) : (
                            <label htmlFor="input-file3" className="info-license-upload">
                                <CameraAltOutlinedIcon fontSize="large" />
                                <button
                                    id="upload-ndl"
                                    type="button"
                                    onClick={() => {
                                    handleClick();
                                    }}
                                    style={{ display: "none" }}
                                >
                                    Thêm ảnh
                                </button>
                                <input
                                    id="input-file3"
                                    type="file"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    accept=".png, .jpg"
                                    onChange={handleFileChange3} 
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

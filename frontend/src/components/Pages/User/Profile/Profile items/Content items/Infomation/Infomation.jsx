import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import StarsIcon from "@mui/icons-material/Stars";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateField } from "@mui/x-date-pickers/DateField";
import { useAuth } from "../../../../../../../Context/AuthProvider";
import Popup from "reactjs-popup";
import Cookies from "js-cookie";
import "./Infomation.css";
import axios from "axios";
import dayjs from "dayjs";
import { FaBorderNone } from "react-icons/fa";

export default function Infomation() {
  let day;
  let dayNID1;
  let dayNID2;
  let dayNDL;

  const { auth, id } = useAuth();
  const [token, setToken] = useState(Cookies.get("token"));

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  
  const [isHovered, setIsHovered] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedFile1_2, setSelectedFile1_2] = useState([]);
  const [selectedFile3, setSelectedFile3] = useState(null);

  const [userInfo, setUserInfo] = useState([]);
  const [userDob, setUserDob] = useState("");
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userPoint, setUserPoint] = useState(0);
  const [userCredit, setUserCredit] = useState(0);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [userNIDInfo, setUserNIDInfo] = useState([]);
  const [userNIDImg, setUserNIDImg] = useState([]);

  const [userNDLInfo, setUserNDLInfo] = useState([]);
  const [userNDLImg, setUserNDLImg] = useState([]);

  const [disableCCCD, setDisableCCCD] = useState(true);
  const [disableGPLX, setDisableGPLX] = useState(true);

  const [checkValidation, setCheckValidation] = useState(true);
  const [checkNumChar, setCheckNumChar] = useState(true);

  const [formDataNDL, setFormDataNDL] = useState({
      NDL: '',
      name: '',
      dateOfBirth: "",
      selectedFile3: "",
      isConfirm: false
  });

  const [formDataNID, setFormDataNID] = useState({
    NID: '',
    name: '',
    dateOfBirth: '',
    native: '',
    address: '',
    dateProvide: '',
    provider: '',
    selectedFile1: "",
    selectedFile2: "",
    isConfirm: false,
  });

  async function getUserInfo() {
    try {
      const response = await axios.get(`http://localhost:4000/user/${id}`);
      const data = response.data;
      setUserInfo(data);      
      setUserName(data.name);
      setUserPhoneNumber(data.phone);
      setUserEmail(data.email);
      setUserDob(handleDate(data.dateOfBirth));
      setUserGender(data?.gender || 'Nam');
      setUserCredit(data.wallet);
      setUserPoint(data.point);
      setUserAvatar(data.imgUrl);
      console.log('hmm');
    } catch (error) {
      console.error("Error fetching User Info: " + error);
    }
  }

  async function getUserNid() {
    try {
      const response = await axios.get(`http://localhost:4000/user/NID/${id}`);
      const data = response.data;
      setUserNIDInfo(data[0]);
      setUserNIDImg(data[1]);
      setFormDataNID({
        NID: data[0]?.NID || '',
        name: data[0]?.name || '',
        dateOfBirth: data[0]?.dateOfBirth || '',
        native: data[0]?.native || '',
        address: data[0]?.address || '',
        dateProvide: data[0]?.dateProvide || '',
        provider: data[0]?.provider || '',
        isConfirm: data[0]?.isConfirm || false,
        selectedFile1: data[1][1]?.url || null,
        selectedFile2: data[1][0]?.url || null
      })
    } catch (error) {
      console.error("Error fetching NID: " + error);
    }
  }

  async function getUserNdl() {
    try {
      const response = await axios.get(`http://localhost:4000/user/NDL/${id}`);
      const data = response.data;
      setUserNDLInfo(data[0]); 
      setUserNDLImg(data[1]);
      setFormDataNDL({
        NDL: data[0]?.NDL || '',
        name: data[0]?.name || '',
        dateOfBirth: data[0]?.dateOfBirth || '',
        isConfirm: data[0]?.isConfirm || false,
        selectedFile3: data[1][0].url || null
      });
      // console.log();
    } catch (error) {
      console.error("Error fetching NDL: " + error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();
      await getUserNid();
      await getUserNdl()
    };
    if (auth) {
    }
    fetchData();
  }, [id]);

  useEffect(() => {}, [userInfo, formDataNID, formDataNDL]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleGPLX = () => {
    setDisableGPLX(!disableGPLX);
  };

  const handleCCCD = () => {
    setDisableCCCD(!disableCCCD);
  };

  const handleDate = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  function convertDateFormat(inputDate) {
    const parts = inputDate.split('-');
    const newDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    
    return newDate;
  }

  const handleChangeNID = (e) => {
    const { name, value } = e.target;
    if (name === 'NID' || name === 'name' || name === 'native' || name === 'address' || name === 'provider') {
      setFormDataNID(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else if (name === 'selectedFile1') {
      const file = e.target.files[0];
      setSelectedFile1_2(prev=>{
        const updatedFiles = [...prev];
        const newValue = file;

        updatedFiles[0] = newValue;

        return updatedFiles;
      });
    } else if (name === 'selectedFile2') {
      const file = e.target.files[0];
      setSelectedFile1_2(prev=>{
        const updatedFiles = [...prev];
        const newValue = file;

        updatedFiles[1] = newValue;

        return updatedFiles;
      });
    }
    console.log(selectedFile1_2);
  };
  
  const handleChangeNDL = (event) => {
    const { name, value } = event.target;
    if (name === 'NDL' || name === 'name') {
      setFormDataNDL(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else if (name === 'selectedFile3') {
      const file = event.target.files[0];
      setSelectedFile3(file);
    }
    console.log(formDataNDL)
  };

  const handleKeyDown = (event) => {
    const forbiddenKeys = ["e", "+", "-", "."];
    // Prevent the characters "e", "+", and "-" from being entered.
    if (forbiddenKeys.includes(event.key)) {
      event.preventDefault();
    }
    // Prevent input when the length is 11 and the key pressed is not delete, backspace, or arrow keys.
    if (
      event.target.value.length >= 11 &&
      !["Delete", "Backspace", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  async function handleChangeAvatar(e,close){
    e.preventDefault();

    try {
      const postData = new FormData();
  
      postData.append('images', selectedAvatar);
      
      console.log(postData);
      const response = await axios.post(`http://localhost:4000/user/update/img/${id}`, postData)
      console.log("Update avatar: " + response);
      setSelectedAvatar(null)
      await getUserInfo();
      close();
      window.location.reload();
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async function handleInfo(e) {
    e.preventDefault();

    if (day === undefined || day === "") {
      day = userDob;
    }

    const postData = {
      name: userName,
      phone: userPhoneNumber,
      dateOfBirth: new Date(convertDateFormat(day)),
      gender: userGender,
    };
    try {
      const response = await axios.post(
        `http://localhost:4000/user/update/${id}`,
        postData
      );
      console.log('succeed')
      await getUserInfo();
      day = ""
    } catch (error) {
      console.error("Error update user", error);
    }
  }

  async function handleSubmitNID(e) {
    e.preventDefault();
    try {
      const postData = new FormData();
      if(dayNID1 === undefined || dayNID1 === "") {
        dayNID1 = handleDate(formDataNID.dateOfBirth)
      }
      if(dayNID2 === undefined || dayNID2 === "") {
        dayNID2 = handleDate(formDataNID.dateProvide)
      }
      console.log([selectedFile1_2])

      postData.append('NID', formDataNID.NID)
      postData.append('name', formDataNID.name)
      postData.append('dateOfBirth', new Date(convertDateFormat(dayNID1)));
      postData.append('native', formDataNID.native)
      postData.append('address', formDataNID.address)
      postData.append('dateProvide', new Date(convertDateFormat(dayNID2)));
      postData.append('provider', formDataNID.provider)
      
      for (let index = 0; index < selectedFile1_2.length; index++) {
        postData.append('images', selectedFile1_2[index]);
      }

      console.log(postData);
      const response = await axios.post(`http://localhost:4000/user/NID/sendConfirm/${id}`,postData);
      console.log('Confirmation sent successfully.');
      handleCCCD();
      await getUserNid();
      dayNID1 = "";
      dayNID2 = "";
      // setSelectedFile3(null);
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  }

  async function handleSubmitNDL(e) {
    e.preventDefault();
    try {
      const postData = new FormData();
      if(dayNDL === undefined || dayNDL === "") {
        dayNDL = handleDate(formDataNDL.dateOfBirth)
      }

      postData.append('NDL', formDataNDL.NDL)
      postData.append('name', formDataNDL.name)
      postData.append('dateOfBirth', new Date(convertDateFormat(dayNDL)));
      postData.append('images', selectedFile3);

      const response = await axios.post(`http://localhost:4000/user/NDL/sendConfirm/${id}`,postData);
      console.log('Confirmation sent successfully.');
      handleGPLX();
      await getUserNdl();
      dayNDL = "";
      // setSelectedFile3(null);
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  }

  const cancelNIDChange = () => {
    console.log("hmm")
    setFormDataNID({
      NID: userNIDInfo?.NDL,
      name: userNIDInfo?.name,
      dateOfBirth: userNIDInfo?.dateOfBirth,
      native: userNIDInfo?.native,
      address: userNIDInfo?.address,
      dateProvide: userNIDInfo?.dateProvide,
      provider: userNIDInfo?.provider,
      isConfirm: userNIDInfo?.isConfirm,
      selectedFile1: userNIDImg[1]?.url,
      selectedFile2: userNIDImg[0]?.url,
    })
    handleCCCD();
  }

  const cancelNDLChange = () => {
    console.log(userNDLInfo.dateOfBirth);
    setFormDataNDL({
      NDL: userNDLInfo?.NDL,
      name: userNDLInfo?.name,
      dateOfBirth: userNDLInfo?.dateOfBirth,
      selectedFile3: userNDLImg[0]?.url,
      isConfirm: userNDLInfo?.isConfirm,
    })
    handleGPLX();
  }

  const checkPattern = (inputValue, pattern) => {
    const regex = new RegExp(pattern);
    return regex.test(inputValue);
  };

  const handlePhoneChange = (event) => {
    let inputPhoneNumber = event.target.value;

    // Regular expression pattern for a valid phone number. You can adjust it as needed.
    const phonePattern =
      "(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}";

    if (!checkPattern(inputPhoneNumber, phonePattern)) {
      setCheckValidation(false);
    } else {
      setCheckValidation(true);
      if (inputPhoneNumber.length > 9 && inputPhoneNumber.length <= 11) {
        setCheckNumChar(true);
      } else {
        setCheckNumChar(false);
      }
    }
    setUserPhoneNumber(event.target.value.trim());
  };

  function handleNameChange(e) {
    const input = e.target.value;
    setUserName(input);
  }
  return (
    <div id="info">
      <div className="container user-profile">
        <div className="title">
          <h2>
            Thông tin tài khoản
            <Popup
              trigger={
                <EditOutlinedIcon
                  style={{ height: "20px", cursor: "pointer" }}
                />
              }
              contentStyle={{
                height: "fit-content",
                width: "fit-content",
                backgroundColor: "white",
                padding: "1em 2em 1.5em 2em",
                borderRadius: "15px",
              }}
              modal
            >
              {(close) => (
                <div className="modal">
                  <h2 style={{ textAlign: "center" }}>Cập nhật thông tin</h2>
                  <br />
                  <form
                    type="submit"
                    style={{
                      display: " flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                      onSubmit={(e) => {
                      handleInfo(e);
                      close();
                    }}
                  >
                    <label>
                      <p
                        style={{
                          fontWeight: "500",
                          lineHeight: "2",
                          color: "#767676",
                        }}
                      >
                        Tên tài khoản
                      </p>
                      <TextField
                        placeholder={userName}
                        size="small"
                        sx={{
                          width: "400px",
                        }}
                        onChange={(e) => handleNameChange(e)}
                        value={userName}
                      ></TextField>
                    </label>
                    <label>
                      <p
                        style={{
                          fontWeight: "500",
                          lineHeight: "2",
                          color: "#767676",
                        }}
                      >
                        Số điện thoại
                      </p>
                      <TextField
                        type="number"
                        placeholder={userPhoneNumber}
                        size="small"
                        sx={{
                          width: "400px",
                        }}
                        onChange={(e) => handlePhoneChange(e)}
                        onKeyDown={handleKeyDown}
                        value={userPhoneNumber}
                        error={!checkValidation || !checkNumChar}
                        helperText={
                          !checkValidation || !checkNumChar
                            ? !userPhoneNumber
                              ? "Xin hãy nhập số điện thoại"
                              : "Số điện thoại không hợp lệ"
                            : ""
                        }
                      ></TextField>
                    </label>
                    <label>
                      <p
                        style={{
                          fontWeight: "500",
                          lineHeight: "2",
                          color: "#767676",
                        }}
                      >
                        Ngày sinh
                      </p>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                          // placeholder={userDob}
                          value={dayjs(convertDateFormat(userDob))}
                          size="small"
                          sx={{
                            width: "400px",
                          }}
                          format="DD-MM-YYYY"
                          onChange={(newDate) => {
                            day = handleDate(newDate);
                          }}
                        ></DateField>
                      </LocalizationProvider>
                    </label>
                    <p
                      style={{
                        fontWeight: "500",
                        lineHeight: "2",
                        color: "#767676",
                      }}
                      >Giới tính
                    </p>
                    <div style={{display: "flex", gap: "20px"}}>
                      <label style={{display: "flex", cursor: "pointer"}}>
                        <input name="gender" type="radio" checked={userInfo.gender === "Nam"} onClick={setUserGender("Nam")} value="Nam"/>
                        <p>Nam</p>
                      </label>
                      <label style={{display: "flex", cursor: "pointer"}}>
                        <input name="gender" type="radio" checked={userInfo.gender === "Nữ"} onClick={setUserGender("Nữ")} value="Nữ"/>
                        <p>Nữ</p>
                      </label>
                    </div>
                    <button
                      type="submit"
                      style={{
                        width: "auto",
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "#5fcf86",
                        borderRadius: "5px",
                        fontWeight: "500",
                        color: "white",
                        cursor: "pointer",
                        border: "none",
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#5fcf86";
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#469963";
                      }}
                    >
                      Cập nhật
                    </button>
                  </form>
                </div>
              )}
            </Popup>
          </h2>
          <div>
            <WorkOutlineOutlinedIcon
              style={{ color: "#9aff6f", height: "30px" }}
            />
            <h2>0 </h2> chuyến
          </div>
        </div>
        <div className="content">
          <div className="avatar-box">
            <Popup
            trigger={
              <div class="avatar-container"  onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                  <img src={userInfo.imgUrl} alt="" />
                  <div class="overlay">
                    <CameraAltOutlinedIcon style={{height: '32px', width: '32px'}}/>
                  </div>
              </div>
            }
            modal
            contentStyle={{
              height: 'fit-content',
              width: '30%',
              backgroundColor: 'white',
              borderRadius: '25px',
              display: 'flex',
              justifyContent: 'center',
              padding: "20px"
            }}
            >
              {close =>
                <form id="img-modal" onSubmit={(e)=>{handleChangeAvatar(e,close);}}>
                  <h2>Chọn ảnh đại diện</h2>
                  <br />
                  <br />
                  <div id="avatar-container"  onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                      <img src={selectedAvatar ? URL.createObjectURL(selectedAvatar) : userInfo.imgUrl} alt=""/>
                  </div>
                  <br />
                  <br />
                  {selectedAvatar ? (
                    <div style={{width: "100%", display: "flex", justifyContent: "center", gap: "10px"}}>
                      <button
                        onClick={(e)=>setSelectedAvatar(null)}
                        style={{
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          width: "40%"
                        }}
                        onMouseEnter={(e)=> e.target.style.backgroundColor = "#ccc"}
                        onMouseLeave={(e)=> e.target.style.backgroundColor = "#fff"}
                      >
                        Hủy
                      </button>
                      <button
                      type="submit"
                      style={{
                        width: "40%",
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "#5fcf86",
                        borderRadius: "5px",
                        fontWeight: "500",
                        color: "white",
                        cursor: "pointer",
                        border: "none"
                      }}
                      onMouseEnter={(e)=> e.target.style.backgroundColor = "#469963"}
                      onMouseLeave={(e)=> e.target.style.backgroundColor = "#5fcf86"}
                      >Xác nhận chọn</button>
                    </div>
                  ):(
                    <div style={{width: "100%"}}>
                      <button
                      type="button"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "#5fcf86",
                        borderRadius: "5px",
                        fontWeight: "500",
                        color: "white",
                        cursor: "pointer",
                        border: "none"
                      }}
                      onMouseEnter={(e)=> e.target.style.backgroundColor = "#469963"}
                      onMouseLeave={(e)=> e.target.style.backgroundColor = "#5fcf86"}
                      onClick={() => {
                        handleClick();
                      }}
                      >Chọn ảnh</button>
                      <input type="file" style={{ display: "none" }} ref={fileInputRef} accept=".png, .jpg" onChange={(e)=>setSelectedAvatar(e.target.files[0])}/>
                    </div>
                  )}
                </form>
              }
            </Popup>
            <div className="ctn">
              <p className="user-name">
                {userInfo.name ? userInfo.name : "User"}
              </p>
              <div className="box point">
                <div>
                  <StarsIcon style={{ height: "20px", color: "yellow" }} />
                </div>
                <p>{userInfo.point ? userInfo.point : 0} điểm</p>
              </div>
            </div>
          </div>
          <div className="info-user">
            <div className="info-box">
              <div className="info-box-item">
                <p>Ngày sinh</p>
                <p className="main">
                  {userInfo.dateOfBirth
                    ? handleDate(userInfo.dateOfBirth)
                    : "--/--/----"}
                </p>
              </div>
              <div className="info-box-item">
                <p>Giới tính</p>
                <p className="main">{userInfo.gender ? userInfo.gender : "Nam"}</p>
              </div>
            </div>
            <div className="info-desc">
              <div className="info-desc-item">
                <p style={{ fontSize: "0.8em" }}>Số điện thoại</p>
                <p className="main">{userInfo.phone ? userInfo.phone : ""}</p>
              </div>
              <div className="info-desc-item">
                <p style={{ fontSize: "0.8em" }}>Email</p>
                <p className="main">{userInfo.email ? userInfo.email : ""}</p>
              </div>
              <div className="info-desc-item">
                <p style={{ fontSize: "0.8em" }}>Ví</p>
                <p className="main">
                  {userInfo.wallet ? userInfo.wallet : "0"} K
                </p>
              </div>
            </div>
            <div className="topup">
              <div
                className="topup-btn"
                onClick={() => navigate("/user/transaction")}
              >
                Nạp
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="container" onSubmit={handleSubmitNID}>
        <div className="title">
          <div>
            <h2>CCCD/CMND</h2>
            <div style={{ fontSize: "10px", padding: "8px" }}>
              {formDataNID ? (
                formDataNID.isConfirm ? (
                  <div
                    style={{
                      backgroundColor: "#00FF00",
                      borderRadius: "8px",
                      padding: "3px",
                      paddingRight: "6px",
                    }}
                  >
                    <CheckCircleOutlinedIcon
                      style={{ height: "10px", width: "12px", color: "green" }}
                    />
                    <p>Đã xác thực</p>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FF6A6A",
                      borderRadius: "8px",
                      padding: "3px",
                      paddingRight: "6px",
                    }}
                  >
                    <HighlightOffOutlinedIcon
                      style={{ height: "10px", width: "12px", color: "red" }}
                    />
                    <p>Chưa xác thực</p>
                  </div>
                )
              ) : (
                <div
                  style={{
                    backgroundColor: "#FF6A6A",
                    borderRadius: "8px",
                    padding: "3px",
                    paddingRight: "6px",
                  }}
                >
                  <HighlightOffOutlinedIcon
                    style={{ height: "10px", width: "12px", color: "red" }}
                  />
                  <p>Chưa xác thực</p>
                </div>
              )}
            </div>
          </div>
          {disableCCCD ? (
            <div className="edit-btn" onClick={handleCCCD}>
              Chỉnh sửa
            </div>
          ) : (
            <div className="btn-container">
              <div onClick={cancelNIDChange} style={{ cursor: "pointer" }}>
                Hủy
              </div>
              <button type="submit" className="edit-btn">
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="content">
          <div className="info-id-card">
            <h3 onClick={() => {console.log(formDataNID)}}>Thông tin chung</h3>
            <h4 style={{ color: "#767676" }}>Số CCCD/CMND</h4>
            <TextField
              name="NID"
              placeholder={formDataNID?.NID ? formDataNID.NID : "Số CCCD/CMND"}
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChangeNID}
              value={formDataNID.NID}
            />
            <h4 style={{ color: "#767676" }}>Họ và tên</h4>
            <TextField
              name="name"
              placeholder={formDataNID?.name ? formDataNID.name : "Họ và tên"}
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChangeNID}
              value={formDataNID.name}
            />
            <h4 style={{ color: "#767676" }}>Ngày sinh</h4>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                name="dateOfBirth"
                value={dayjs(convertDateFormat(handleDate(formDataNID.dateOfBirth)))}
                size="small"
                sx={{
                  width: "400px",
                }}
                format="DD-MM-YYYY"
                required
                disabled={disableCCCD}
                onChange={(newDate) => {
                  dayNID1 = handleDate(newDate);
                }}
              ></DateField>
            </LocalizationProvider>
            <h4 style={{ color: "#767676" }}>Quê quán</h4>
            <TextField
              name="native"
              placeholder={
                formDataNID?.native ? formDataNID.native : "Quê quán"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChangeNID}
              value={formDataNID.native}
            />

            <h4 style={{ color: "#767676" }}>Nơi thường trú</h4>
            <TextField
              name="address"
              placeholder={
                formDataNID?.address ? formDataNID.address : "Nơi thường trú"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChangeNID}
              value={formDataNID.address}
            />

            <h4 style={{ color: "#767676" }}>Ngày cấp</h4>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                name="dateProvide"
                value={dayjs(convertDateFormat(handleDate(formDataNID.dateProvide)))}
                size="small"
                sx={{
                  width: "400px",
                }}
                format="DD-MM-YYYY"
                required
                disabled={disableCCCD}
                onChange={(newDate) => {
                  dayNID2 = handleDate(newDate);
                }}
              ></DateField>
            </LocalizationProvider>

            <h4 style={{ color: "#767676" }}>Nơi cấp</h4>
            <TextField
              name="provider"
              placeholder={
                formDataNID?.provider ? formDataNID.provider : "Nơi cấp"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChangeNID}
              value={formDataNID.provider}
            />
          </div>
          <div className="info-id-card">
            <h3>Hình ảnh</h3>
            <p>Mặt trước:</p>
            {formDataNID.selectedFile1 ? (
              <div className="img-container">
                <label
                  htmlFor="input-file1"
                  className="info-license-upload"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={selectedFile1_2[0] ? URL.createObjectURL(selectedFile1_2[0]) : formDataNID.selectedFile1}
                    style={{ width: "100%", height: "auto" }}
                    className="uploaded-image"
                  />
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
                    name="selectedFile1"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleChangeNID}
                    disabled={disableCCCD}
                  />
                </label>
              </div>
            ) : (
              <label htmlFor="input-file1" className="info-license-upload">
                <CameraAltOutlinedIcon fontSize="large" />
                <button
                  id="upload-nid"
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
                  name="selectedFile1"
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".png, .jpg"
                  onChange={handleChangeNID}
                  disabled={disableCCCD}
                />
              </label>
            )}
            <p>Mặt sau:</p>
            {formDataNID.selectedFile2 ? (
              <div className="img-container">
                <label
                  htmlFor="input-file2"
                  className="info-license-upload"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={selectedFile1_2[1] ? URL.createObjectURL(selectedFile1_2[1]) : formDataNID.selectedFile2}
                    style={{ width: "100%", height: "auto" }}
                    className="uploaded-image"
                  />
                  <button
                    id="upload-nid"
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
                    name="selectedFile2"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleChangeNID}
                    disabled={disableCCCD}
                  />
                </label>
              </div>
            ) : (
              <label htmlFor="input-file2" className="info-license-upload">
                <CameraAltOutlinedIcon fontSize="large" />
                <button
                  id="upload-nid"
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
                  name="selectedFile2"
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".png, .jpg"
                  onChange={handleChangeNID}
                  disabled={disableCCCD}
                />
              </label>
            )}
          </div>
        </div>
      </form>

      <form className="container" onSubmit={handleSubmitNDL}>
        <div className="title">
          <div>
            <h2 style={{ paddingRight: "8px" }}>Giấy phép lái xe</h2>
            <div style={{ fontSize: "10px", padding: "8px" }}>
              {formDataNDL ? (
                formDataNDL.isConfirm ? (
                  <div
                    style={{
                      backgroundColor: "#00FF00",
                      borderRadius: "8px",
                      padding: "3px",
                      paddingRight: "6px",
                    }}
                  >
                    <CheckCircleOutlinedIcon
                      style={{ height: "10px", width: "12px", color: "green" }}
                    />
                    <p>Đã xác thực</p>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "#FF6A6A",
                      borderRadius: "8px",
                      padding: "3px",
                      paddingRight: "6px",
                    }}
                  >
                    <HighlightOffOutlinedIcon
                      style={{ height: "10px", width: "12px", color: "red" }}
                    />
                    <p>Chưa xác thực</p>
                  </div>
                )
              ) : (
                <div
                  style={{
                    backgroundColor: "#FF6A6A",
                    borderRadius: "8px",
                    padding: "3px",
                    paddingRight: "6px",
                  }}
                >
                  <HighlightOffOutlinedIcon
                    style={{ height: "10px", width: "12px", color: "red" }}
                  />
                  <p>Chưa xác thực</p>
                </div>
              )}
            </div>
          </div>
          {disableGPLX ? (
            <div className="edit-btn" onClick={handleGPLX}>
              Chỉnh sửa
            </div>
          ) : (
            <div className="btn-container">
              <div onClick={cancelNDLChange} style={{ cursor: "pointer" }}>
                Hủy
              </div>
              <button type="submit" className="edit-btn">
                Lưu
              </button>
            </div>
          )}
        </div>
        <div className="content">
          <div className="info-license">
            <h3>Thông tin chung</h3>
            <h4 style={{ color: "#767676" }}>Số GPLX</h4>
            <TextField
              name="NDL"
              placeholder={formDataNDL?.NDL ? formDataNDL.NDL : "Số GPLX"}
              size="small"
              sx={{
                width: "400px",
              }}
              value={formDataNDL.NDL || ''}
              required
              disabled={disableGPLX}
              onChange={handleChangeNDL}
            />
            <h4 style={{ color: "#767676" }}>Họ và tên</h4>
            <TextField
              name="name"
              placeholder={formDataNDL?.name ? formDataNDL.name : "Họ và tên"}
              size="small"
              sx={{
                width: "400px",
              }}
              value={formDataNDL.name || ''}
              required
              disabled={disableGPLX}
              onChange={handleChangeNDL}
            />
            <h4 style={{ color: "#767676" }}>Ngày sinh</h4>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateField
                name="dateOfBirth"
                value={dayjs(convertDateFormat(handleDate(formDataNDL.dateOfBirth)))}
                size="small"
                sx={{
                  width: "400px",
                }}
                format="DD-MM-YYYY"
                required
                disabled={disableGPLX}
                onChange={(newDate) => {
                  dayNDL = handleDate(newDate);
                }}
              ></DateField>
            </LocalizationProvider>
          </div>
          <div className="info-license">
            <h3>Hình ảnh</h3>
            {formDataNDL.selectedFile3 ? (
              <div className="img-container">
                <label
                  htmlFor="input-file3"
                  className="info-license-upload"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={selectedFile3 ? URL.createObjectURL(selectedFile3) : formDataNDL.selectedFile3}
                    style={{ width: "100%", height: "auto" }}
                    className="uploaded-image"
                  />
                  <button
                    id="upload-nid"
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
                    name="selectedFile3"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleChangeNDL}
                    required
                    disabled={disableGPLX}
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
                  name="selectedFile3"
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".png, .jpg"
                  onChange={handleChangeNDL}
                  required
                  disabled={disableGPLX}
                />
              </label>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

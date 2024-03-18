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
  const { auth, id } = useAuth();
  const [token, setToken] = useState(Cookies.get("token"));

  const fileInputRef = useRef(null);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);

  const [userId, setUserId] = useState("");

  const [userInfo, setUserInfo] = useState([]);
  const [userDob, setUserDob] = useState("");
  const [userName, setUserName] = useState("");
  const [userPoint, setUserPoint] = useState(0);
  const [userCredit, setUserCredit] = useState(0);
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [userNIDInfo, setUserNIDInfo] = useState([]);
  const [userNIDImg, setUserNIDImg] = useState([]);
  const [idNumber, setIdNumber] = useState("");
  const [idName, setIdName] = useState("");
  const [idDob, setIdDob] = useState("");
  const [idNative, setIdNative] = useState("");
  const [idAddress, setIdAddress] = useState("");
  const [idProvideDate, setIdProvideDate] = useState("");
  const [idProvider, setIdProvider] = useState("");

  const [userNDLInfo, setUserNDLInfo] = useState([]);
  const [userNDLImg, setUserNDLImg] = useState([]);
  const [dlNumber, setDlNumber] = useState("");
  const [dlName, setDlName] = useState("");
  const [dlDob, setDlDob] = useState("");

  const [disableCCCD, setdisableCCCD] = useState(true);
  const [disableGPLX, setdisableGPLX] = useState(true);

  const [checkValidation, setCheckValidation] = useState(true);
  const [checkNumChar, setCheckNumChar] = useState(true);

  const [tempDate, setTempDate] = useState(dayjs(""));

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    NID: '',
    name: '',
    dateOfBirth: '',
    native: '',
    address: '',
    dateProvide: '',
    provider: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(formData);
  };

  async function getUserInfo() {
    try {
      const response = await axios.get(`http://localhost:4000/user/${id}`);
      const data = response.data;
      setUserInfo(data);
      return data.id;
    } catch (error) {
      console.error("Error fetching User Info: " + error);
    }
  }

  async function getUserNid(id) {
    try {
      const response = await axios.get(`http://localhost:4000/user/NID/${id}`);
      const data = response.data;
      setUserNIDInfo(data[0]); // Fix: Use data directly instead of userNID
      setUserNIDImg(data[1]); // Fix: Use data directly instead of userNI
    } catch (error) {
      console.error("Error fetching NID: " + error);
    }
  }

  async function getUserNdl(id) {
    try {
      const response = await axios.get(`http://localhost:4000/user/NDL/${id}`);
      const data = response.data;
      setUserNDLInfo(data[0]); // Fix: Use data directly instead of userNDL
      setUserNDLImg(data[1]); // Fix: Use data directly instead of userNDL
    } catch (error) {
      console.error("Error fetching NDL: " + error);
    }
  }

  useEffect(() => {
    const fetchData = () => {
      getUserInfo()
        .then((id) => {
          if (id) {
            return Promise.all([getUserNid(id), getUserNdl(id)]);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    };
    if (auth) {
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.name);
      setUserPhoneNumber(userInfo.phone);
      setUserEmail(userInfo.email);
      setUserDob(handleDate(userInfo.dateOfBirth));
      setUserCredit(userInfo.wallet);
      setUserPoint(userInfo.point);
    }

    if (userNIDInfo) {
      setIdNumber(userNIDInfo.NID);
      setIdName(userNIDInfo.name);
      setIdDob(handleDate(userNIDInfo.dateOfBirth));
      setIdNative(userNIDInfo.native);
      setIdAddress(userNIDInfo.address);
      setIdProvideDate(handleDate(userNIDInfo.dateProvide));
      setIdProvider(userNIDInfo.provider);
      setFormData({
        NID: userNIDInfo.NID,
        name: userNIDInfo.name,
        dateOfBirth: userNIDInfo.dateOfBirth,
        native: userNIDInfo.native,
        address: userNIDInfo.address,
        dateProvide: userNIDInfo.dateProvide,
        provider: userNIDInfo.provider
      })
    }

    if (userNDLInfo) {
      setDlNumber(userNDLInfo.NDL);
      setDlName(userNDLInfo.name);
      setDlDob(handleDate(userNDLInfo.dateOfBirth));
    }
  }, [userInfo, userNIDInfo, userNDLInfo]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleGPLX = () => {
    setdisableGPLX(!disableGPLX);
  };

  const handleEditCCCD = () => {
    setdisableCCCD(!disableCCCD);
  };

  const handleDate = (d) => {
    const date = new Date(d);
    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    // Format as "--/--/----"
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
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

  async function handleInfo(e) {
    console.log(userName);
    console.log(userPhoneNumber);
    console.log(tempDate.toJSON());
    e.preventDefault();
    const postData = {
      name: userName,
      phone: userPhoneNumber,
      dateOfBirth: tempDate,
    };
    console.log(postData);
    try {
      const response = await axios.post(
        `
            http://localhost:4000/user/update/${id}`,
        postData
      );
      await getUserInfo(userEmail);
    } catch (error) {
      console.error("Error update user", error);
    }
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
                          placeholder={userDob}
                          size="small"
                          sx={{
                            width: "400px",
                          }}
                          format="DD-MM-YYYY"
                          onChange={(newDate) => {
                            setTempDate(newDate);
                          }}
                        ></DateField>
                      </LocalizationProvider>
                    </label>
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
            <div className="avatar-container">
              <img src="" alt="" />
            </div>
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
                <p className="main">{userInfo.gender ? userInfo.gender : ""}</p>
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

      <div className="container">
        <div className="title">
          <div>
            <h2>CCCD/CMND</h2>
            <div style={{ fontSize: "10px", padding: "8px" }}>
              {userNIDInfo ? (
                userNIDInfo.isConfirm ? (
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
            <div className="edit-btn" onClick={handleEditCCCD}>
              Chỉnh sửa
            </div>
          ) : (
            <div className="btn-container">
              <div onClick={handleEditCCCD} style={{ cursor: "pointer" }}>
                Hủy
              </div>
              <div className="edit-btn" onClick={handleEditCCCD}>
                Lưu
              </div>
            </div>
          )}
        </div>
        <form className="content">
          <div className="info-id-card">
            <h3 onClick={() => {console.log(formData)}}>Thông tin chung</h3>
            <h4 style={{ color: "#767676" }}>Số CCCD/CMND</h4>
            <TextField
              placeholder={userNIDInfo?.NID ? userNIDInfo.NID : "Số CCCD/CMND"}
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.NID}
            />
            <h4 style={{ color: "#767676" }}>Họ và tên</h4>
            <TextField
              placeholder={userNIDInfo?.name ? userNIDInfo.name : "Họ và tên"}
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.name}
            />
            <h4 style={{ color: "#767676" }}>Ngày sinh</h4>
            <TextField
              placeholder={
                userNIDInfo?.dateOfBirth
                  ? handleDate(userNIDInfo.dateOfBirth)
                  : "--/--/----"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.dateOfBirth}
            />
            <h4 style={{ color: "#767676" }}>Quê quán</h4>
            <TextField
              placeholder={
                userNIDInfo?.native ? userNIDInfo.native : "Quê quán"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.native}
            />

            <h4 style={{ color: "#767676" }}>Nơi thường trú</h4>
            <TextField
              placeholder={
                userNIDInfo?.address ? userNIDInfo.address : "Nơi thường trú"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.address}
            />

            <h4 style={{ color: "#767676" }}>Ngày cấp</h4>
            <TextField
              placeholder={
                userNIDInfo?.dateProvide
                  ? handleDate(userNIDInfo.dateProvide)
                  : "--/--/----"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.dateProvide}
            />

            <h4 style={{ color: "#767676" }}>Nơi cấp</h4>
            <TextField
              placeholder={
                userNIDInfo?.provider ? userNIDInfo.provider : "Nơi cấp"
              }
              required
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableCCCD}
              onChange={handleChange}
              value={formData.provider}
            />
          </div>
          <div className="info-id-card">
            <h3>Hình ảnh</h3>
            <p>Mặt trước:</p>
            {selectedFile1 ? (
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
                    src={URL.createObjectURL(selectedFile1)}
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
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleFileChange1}
                    disabled={disableCCCD}
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
                  disabled={disableCCCD}
                />
              </label>
            )}
            <p>Mặt sau:</p>
            {selectedFile2 ? (
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
                    src={URL.createObjectURL(selectedFile2)}
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
                    id="input-file2"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleFileChange2}
                    disabled={disableCCCD}
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
                  disabled={disableCCCD}
                />
              </label>
            )}
          </div>
        </form>
      </div>

      <div className="container">
        <div className="title">
          <div>
            <h2 style={{ paddingRight: "8px" }}>Giấy phép lái xe</h2>
            <div style={{ fontSize: "10px", padding: "8px" }}>
              {userNDLInfo ? (
                userNDLInfo.isConfirm ? (
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
              <div onClick={handleGPLX} style={{ cursor: "pointer" }}>
                Hủy
              </div>
              <div className="edit-btn" onClick={handleGPLX}>
                Lưu
              </div>
            </div>
          )}
        </div>
        <div className="content">
          <div className="info-license">
            <h3>Thông tin chung</h3>
            <h4 style={{ color: "#767676" }}>Số GPLX</h4>
            <TextField
              placeholder={userNDLInfo?.NDL ? userNDLInfo.NDL : "Số GPLX"}
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableGPLX}
            />
            <h4 style={{ color: "#767676" }}>Họ và tên</h4>
            <TextField
              placeholder={userNDLInfo?.name ? userNDLInfo.name : "Họ và tên"}
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableGPLX}
            />
            <h4 style={{ color: "#767676" }}>Ngày sinh</h4>
            <TextField
              placeholder={
                userNDLInfo?.dateOfBirth
                  ? handleDate(userNDLInfo.dateOfBirth)
                  : "--/--/----"
              }
              size="small"
              sx={{
                width: "400px",
              }}
              disabled={disableGPLX}
            />
          </div>
          <div className="info-license">
            <h3>Hình ảnh</h3>
            {selectedFile3 ? (
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
                    src={URL.createObjectURL(selectedFile3)}
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
                    id="input-file3"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept=".png, .jpg"
                    onChange={handleFileChange3}
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
                  type="file"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  accept=".png, .jpg"
                  onChange={handleFileChange3}
                  disabled={disableGPLX}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

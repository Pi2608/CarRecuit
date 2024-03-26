import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../Pages/Login/LoginForm/LoginForm.jsx";
import { useAuth } from "../../../Context/AuthProvider.jsx";
import { Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popup from "reactjs-popup";
import axios from "axios";
import logo from "../../../images/carFlexLogo.jpg"
import "./Header.css";

function Header() {
    const [isTriggerClicked, setIsTriggerClicked] = useState(false)
    const [ userInfo, setUserInfo] = useState([])
    const { auth, id } = useAuth()

    const handleLogin = () => {
        setIsTriggerClicked(true)
    }

    const navigate = useNavigate()

    useEffect(() =>{},[auth])

    useEffect(() =>{
        getUser();
    },[id])

    useEffect(() =>{},[userInfo])

    async function getUser(){
        try {
            const response = await axios.get(`http://localhost:4000/user/${id}`)
            const data = response.data;
            setUserInfo(data)
        } catch (error) {
            console.error("Error fetching User Info: " + error)
        }
    }

    return(
        <div id="header">
            <div className="header-container">
                <div className="logo-container" onClick={()=>navigate("/")}>
                    <img src={logo}/>
                    <h1>CarFlex</h1>
                </div>
                <div className="menu-container">
                    <a className="menu-item">About CarFlex</a>
                    <a className="menu-item" onClick={()=> navigate("/user/mycars")}>Trở thành chủ xe</a>
                    <div class="vertical-line"></div>
                    {auth ? (
                        <div className="menu-item user-container" onClick={() => navigate("/user/profile")}>
                            {userInfo.name ? <div style={{display: "flex"}}>
                                <NotificationsIcon/>
                                <div>
                                    <p style={{paddingLeft: "20px"}}>{userInfo.name}</p>
                                </div>
                            </div> : <CircularProgress/>}
                        </div>
                    ) : (
                        <Popup
                            trigger={
                                <Button 
                                    className="login"
                                    variant="outlined" 
                                    size="large" 
                                    style={{
                                        borderColor: "#00BF54", 
                                        color: "#00BF54", 
                                        fontWeight: "bold"
                                    }}
                                    onClick={handleLogin}
                                >
                                    Đăng nhập
                                </Button>
                            }
                            position="center"
                            modal
                        >
                            {close => (
                                <div className="login-popup">
                                    <LoginForm/>
                                </div>
                            )}
                        </Popup>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../../Pages/Login/LoginForm/LoginForm.jsx";
import { useAuth } from "../../../Context/AuthProvider.jsx";
import { Button } from "@mui/material";
import Popup from "reactjs-popup";
import "./Header.css";

function Header() {
    const [isTriggerClicked, setIsTriggerClicked] = useState(false)
    const { auth } = useAuth()

    const handleLogin = () => {
        setIsTriggerClicked(true)
    }

    const navigate = useNavigate()

    return(
        <div id="header">
            <div className="header-container">
                <div className="logo-container" onClick={()=>navigate("/")}>
                    <h1>CarFlex</h1>
                </div>
                <div className="menu-container">
                    <a className="menu-item">About CarFlex</a>
                    <a className="menu-item" onClick={()=> navigate("/mycars")}>Trở thành chủ xe</a>
                    <div class="vertical-line"></div>
                    {auth ? 
                        <div className="menu-item user-container" onClick={() => navigate("/user/profile")}>User</div> :
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
                                onClick={handleLogin}>
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
                    }
                </div>
            </div>
        </div>
    )
}

export default Header
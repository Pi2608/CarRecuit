import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import LoginForm from "../../features/LoginForm/LoginForm";
import Popup from "reactjs-popup";
import "./Header.css";

function Header() {
     const [isTriggerClicked, setIsTriggerClicked] = useState(false);

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
                    <div className="menu-item user-container" onClick={() => navigate("/profile")}>User</div>
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
                        {(close) => (
                            <div className="login-popup">
                                <LoginForm/>
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
        </div>
    )
}

export default Header
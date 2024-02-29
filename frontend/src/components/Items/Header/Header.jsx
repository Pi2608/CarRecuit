import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import LoginForm from "../../features/LoginForm/LoginForm";
import Popup from "reactjs-popup";

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
                    <a className="menu-item">Become a partner</a>
                    <div class="vertical-line"></div>
                    <div className="menu-item user-container">
                        <Link to={"/profile"}>User</Link>
                    </div>
                    <Popup
                        trigger={
                            <button type="button" className="login" onClick={handleLogin}>
                                <span>Đăng nhập</span>
                            </button>
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
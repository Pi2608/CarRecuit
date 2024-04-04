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
    const [ notiList, setNotiList] = useState([])
    const [ display, setDisplay] = useState(false)
    const { auth, id } = useAuth()

    const handleLogin = () => {
        setIsTriggerClicked(true)
    }

    const handleNoti = () => {
        setDisplay(!display)
    }

    const handleDate = (d) => {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    };

    const navigate = useNavigate()

    useEffect(() =>{},[auth])

    useEffect(() =>{
        async function fetchData(){
            await getUser();
            // await getNotifications()
        }
        fetchData();
    },[id])

    useEffect(() =>{},[userInfo])

    async function getUser(){
        try {
            const response = await axios.get(`http://localhost:4000/user/${id}`)
            const data = response.data;
            setUserInfo(data)
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching User Info: " + error)
        }
    }

    async function getNotifications(){
        try {
            const response = await axios.get(`http://localhost:4000/user/notification/${id}`);
            const data = response.data;

            if (response.data.length > 0) {
                const notiDataPromise = data.map(async (noti) => {
                    try {
                        console.log(noti.senderId)
                        const userResponse = await axios.get(`http://localhost:4000/user/${noti.senderId}`);
                        const userData = userResponse.data;
        
                        const imagePromise = new Promise((resolve) => {
                            const img = new Image();
                            img.src = userData.imgUrl; // Assuming the user's image URL is stored in a property named 'imgUrl'
                            img.onload = () => resolve(img.src);
                            img.onerror = () => resolve(null);
                        });
                        
                        const title = noti.title;
                        const message = noti.message;
                        const date = handleDate(noti.dateUp);
                        const imageUrl = await imagePromise;
        
                        return {
                            title : title,
                            message: message,
                            dateUp: date,
                            userImage: imageUrl
                        };
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        return null;
                    }
                }
            );
                const notiData = await Promise.all(notiDataPromise);
                setNotiList(notiData.filter(noti => noti !== null));
                // setFeedbackDetail(notiData.filter(noti => noti !== null)[0].feedback);
                console.log(notiData)
            }
        } catch (error) {
            console.error("Error fetching Noti: " + error)
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
                        <div className="menu-item user-container">
                            {userInfo.name ? <div style={{display: "flex"}}>
                                <div onClick={handleNoti} style={{position: "relative", display: "inline-block"}}>
                                    <NotificationsIcon/>
                                    {notiList.length > 0 && <span style={{position: "absolute", top: "0", right: "0", width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%"}}/>}
                                </div>
                                <div className="noti" style={display ? {display: "block"} : {display: "none"}}>
                                    <h2 style={{padding: "20px"}}>Thông báo</h2>
                                    <hr />
                                    {notiList?.map((noti) =>
                                        <div key={noti.id}>
                                            <h5 style={{padding: "15px 20px 5px 20px"}}>{noti.title}</h5>
                                            <p style={{padding: "0 20px"}}>{noti.message}</p>
                                            <p style={{padding: " 5px 20px 15px 20px "}}>{noti.dateUp}</p>
                                            <hr style={{margin: "0 0 20px 0"}}/>
                                        </div>
                                    )}
                                </div>
                                <div  onClick={() => navigate("/user/profile")}>
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
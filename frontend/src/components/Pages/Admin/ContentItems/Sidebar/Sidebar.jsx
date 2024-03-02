import "./Sidebar.css"
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
  return (
    <div className='sidebar'>
        <div className="top">
            <span className="logo">CarFlex</span>
        </div>
        <hr />
        <div className="center">
            <ul>
                <li onClick={() => navigate("/dashboard")}>
                <DashboardIcon className="icon" />
                    <span>Dashboard</span>
                </li>
                <li onClick={() => navigate("/users")}>
                <PersonOutlineIcon className="icon"/>
                    <span>Người dùng</span>
                </li>
                <li onClick={() => navigate("/cars")}>
                <TimeToLeaveIcon className="icon"/>
                    <span>Danh sách xe</span>
                </li>
                
                <li onClick={() => navigate("/voucher")}>
                <CardGiftcardIcon className="icon"/>
                    <span>Voucher</span>
                </li>
                <li onClick={() => navigate("/statistic")}>
                <AssessmentOutlinedIcon className="icon"/>
                    <span>Thống kê</span>
                </li>                         
                <li onClick={() => navigate("/confirm")}>
                <AccountCircleOutlinedIcon className="icon"/>
                    <span>Xác nhận thông tin</span>
                </li>
                <li>
                <LogoutOutlinedIcon className="icon"/>
                    <span>Đăng xuất</span>
                </li>
            </ul>
        </div>
        
    </div>
  )
}

export default Sidebar
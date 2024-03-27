import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../Context/AuthProvider";

const Sidebar = () => {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () =>{
    logout();
    navigate("/");
  }
  
  return (
    <div id="adsidebar">
      <div className="top">
        <span className="logo" style={{cursor: "pointer"}} onClick={() => navigate("/admin/dashboard")}>CarFlex</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li onClick={() => navigate("/admin/dashboard")}>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <li onClick={() => navigate("/admin/users")}>
            <PersonOutlineIcon className="icon" />
            <span>Người dùng</span>
          </li>
          <li onClick={() => navigate("/admin/cars")}>
            <TimeToLeaveIcon className="icon" />
            <span>Danh sách xe</span>
          </li>

          <li onClick={() => navigate("/admin/voucher")}>
            <CardGiftcardIcon className="icon" />
            <span>Voucher</span>
          </li>
          <li onClick={() => navigate("/admin/confirm")}>
            <div className="item">
              <NotificationsNoneOutlinedIcon className="icon" />
            </div>
            <span>Xác nhận thông tin</span>
          </li>
          <li onClick={() => handleLogout()}>
            <LogoutOutlinedIcon className="icon" />
            <span>Đăng xuất</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

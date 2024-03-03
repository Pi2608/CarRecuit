import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div id="adsidebar">
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
            <PersonOutlineIcon className="icon" />
            <span>Người dùng</span>
          </li>
          <li onClick={() => navigate("/cars")}>
            <TimeToLeaveIcon className="icon" />
            <span>Danh sách xe</span>
          </li>

          <li onClick={() => navigate("/voucher")}>
            <CardGiftcardIcon className="icon" />
            <span>Voucher</span>
          </li>
          <li onClick={() => navigate("/statistic")}>
            <AssessmentOutlinedIcon className="icon" />
            <span>Thống kê</span>
          </li>
          <li onClick={() => navigate("/confirm")}>
            <div className="item">
              <NotificationsNoneOutlinedIcon className="icon" />
              <div className="counters">1</div>
            </div>
            <span>Xác nhận thông tin</span>
          </li>
          <li>
            <LogoutOutlinedIcon className="icon" />
            <span>Đăng xuất</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

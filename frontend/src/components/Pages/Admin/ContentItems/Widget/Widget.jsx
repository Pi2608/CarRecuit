import "./Widget.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Import KeyboardArrowDownIcon
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useNavigate } from "react-router-dom";

const Widget = ({ type, amount, diff }) => {
  const navigate = useNavigate();
  let data;

  switch (type) {
    case "user":
      data = {
        title: "Người dùng",
        isMoney: false,
        link: "Xem tất cả",
        path: "admin/users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Chuyến xe trong tháng",
        isMoney: false,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "Thu nhập trong tháng",
        isMoney: true,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div id="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "VND"} {amount}
        </span>
        <span className="link" onClick={() => navigate(data.path)}>{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive" style={diff ? {} : { display: "none" }}>
          {diff >= 0 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon style={{ color: "red" }} />} {/* Conditionally render arrow icon and change color to red */}
          <span style={{ color: diff < 0 ? "red" : "inherit" }}>{Math.abs(diff)} %</span> {/* Conditionally change color to red if diff is less than 0 */}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;


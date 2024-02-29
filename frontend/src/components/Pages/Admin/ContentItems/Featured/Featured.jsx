import "./Featured.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  return (
    <div className='featured'>
        <div className="top">
            <h1 className="title">Tổng doanh thu</h1>
            <MoreVertIcon fontSize="small" />
        </div>
        <div className="bottom">
            <div className="featuredChart">
                <CircularProgressbar value={70} text={"70%"} strokeWidth={10}/>
            </div>
            <p className="title">Tổng doanh số thuê xe ngày hôm nay</p>
            <p className="amount">420VND</p>
        </div>
    </div>
  )
}

export default Featured
import axios from "axios";
import "./Featured.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  const [earning, setEarning]= useState('')
  useEffect(()=>{
    fetchEarning()
  },[])
  async function fetchEarning(){
    try {
      const response = await axios.get('http://localhost:4000/rent/earning/statisticToday');
      setEarning (response.data.earning)
    } catch (error) {
      
    }
  }
  return (
    <div id='featured'>
        <div className="top">
            <h1 className="title">Tổng doanh thu</h1>
            <MoreVertIcon fontSize="small" />
        </div>
        <div className="bottom">
            <div className="featuredChart">
                <CircularProgressbar value={earning/2000*100} text={earning/2000*100+"%"} strokeWidth={10}/>
            </div>
            <p className="title">Tổng doanh thu thuê xe ngày hôm nay</p>
            <p className="amount">{earning*1000} VND </p>
        </div>
    </div>
  )
}

export default Featured
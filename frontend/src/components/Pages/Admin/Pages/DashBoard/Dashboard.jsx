import "./Dashboard.css";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import Navbar from "../../ContentItems/Navbar/Navbar";
import Widget from "../../ContentItems/Widget/Widget";
import Featured from "../../ContentItems/Featured/Featured";
import Chart from "../../ContentItems/Chart/Chart";
import TableTransaction from "../../ContentItems/TableTransaction/TableTransaction";
import { useState, useEffect } from "react";
import axios from "axios";

const DashBoard = () => {
  const [userAmount, setUserAmount]= useState('')
  const [rent , setRent] = useState([])
  const [earningAmount, setEarningAmount] = useState('')

  useEffect(()=>{
    getCountUser()
    getCountRent()
  },[])
  async function getCountUser(){
    const response = await axios.get('http://localhost:4000/user/counting')
    setUserAmount(response.data.amount)
  }
  async function getCountRent (){
    const response = await axios.get('http://localhost:4000/rent/statisticCurrent')
    setRent(response.data)
  }
  return (
    <div id="dashboard">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" amount={userAmount} />
          <Widget type="order" amount={rent.total} diff={rent.diff*100} />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Doanh thu 12 tháng" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Giao dịch</div>
          <TableTransaction />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

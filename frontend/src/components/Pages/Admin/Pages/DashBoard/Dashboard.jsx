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
  const [userAmount, setUserAmount] = useState('');
  const [rent, setRent] = useState([]);
  const [earningAmount, setEarningAmount] = useState([]);
  const [chartTitle, setChartTitle] = useState('Số chuyến xe trong năm nay');
  const [chartType, setChartType] = useState(true)

  useEffect(() => {
    getCountUser();
    getCountRent();
    getCountEarning();
  }, []);

  async function getCountUser() {
    const response = await axios.get('http://localhost:4000/user/counting');
    setUserAmount(response.data.amount);
  }

  async function getCountRent() {
    const response = await axios.get('http://localhost:4000/rent/statisticCurrent');
    setRent(response.data);
  }

  async function getCountEarning() {
    const response = await axios.get('http://localhost:4000/rent/earning/statisticCurrent');
    setEarningAmount(response.data);
  }

  const handleWidgetClick = (type) => {
    switch (type) {
      case "order":
        setChartTitle("Số chuyến xe trong năm nay");
        setChartType(true)
        break;
      case "earning":
        setChartTitle("Thu nhập trong năm nay");
        setChartType(false)
        break;
    }
  };

  return (
    <div id="dashboard">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <div>
          <Widget type="user" amount={userAmount} />
          </div>
          <div onClick={() => handleWidgetClick("order")}>
          <Widget type="order" amount={rent.total} diff={rent.diff * 100} />
          </div>
          <div onClick={() => handleWidgetClick("earning")}>
          <Widget type="earning" amount={earningAmount.earning * 1000} diff={earningAmount.diff * 100} />
          </div>
        </div>
        <div className="charts">
          <Featured />
          <Chart title={chartTitle} aspect={2 / 1} type={chartType}/>
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
import "./Dashboard.css";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import Navbar from "../../ContentItems/Navbar/Navbar";
import Widget from "../../ContentItems/Widget/Widget";
import Featured from "../../ContentItems/Featured/Featured";
import Chart from "../../ContentItems/Chart/Chart";
import TableTransaction from "../../ContentItems/TableTransaction/TableTransaction";

const DashBoard = () => {
  return (
    <div className='home'>
        <Sidebar />
        <div className="homeContainer">
          <Navbar/>
          <div className="widgets">
            <Widget type="user"/>
            <Widget type="order"/>
            <Widget type="earning"/>
            
          </div>
          <div className="charts">
            <Featured/>
            <Chart title="Doanh thu 12 tháng" aspect={2 / 1} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Giao dịch</div>
            <TableTransaction/>
          </div>
        </div>
    </div>
  );
};

export default DashBoard;
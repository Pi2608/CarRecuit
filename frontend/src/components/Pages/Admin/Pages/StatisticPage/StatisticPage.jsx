import Navbar from "../../ContentItems/Navbar/Navbar";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import Statistic from "../../ContentItems/Statistic/Statistic";
import "./StatisticPage.css";

const StatisticPage = () => {
  return (
    <div className="list">
        <Sidebar/>
        <div className="listContainer">
            <Navbar/>
            <Statistic/>
            
        </div>
    </div>
  )
}

export default StatisticPage
import ConfirmInfo from "../../ContentItems/ConfirmInfo/ConfirmInfo";
import Navbar from "../../ContentItems/Navbar/Navbar";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import "./ConfirmInfoPage.css";

const ConfirmInfoPage = () => {
  return (
    <div id="list">
        <Sidebar/>
        <div className="listContainer">
            <Navbar/>
            <ConfirmInfo/>
            
        </div>
    </div>
  );
};

export default ConfirmInfoPage;
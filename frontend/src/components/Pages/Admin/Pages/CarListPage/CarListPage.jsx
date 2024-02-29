import CarList from "../../ContentItems/CarList/CarList";
import Navbar from "../../ContentItems/Navbar/Navbar";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import "./CarListPage.css";

const CarListPage = () => {
  return (
    <div className="list">
        <Sidebar/>
        <div className="listContainer">
            <Navbar/>
            <CarList/>
            
        </div>
    </div>
  );
};

export default CarListPage;
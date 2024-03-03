import Navbar from "../../ContentItems/Navbar/Navbar";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";
import VoucherList from "../../ContentItems/VoucherList/VoucherList";
import "./VoucherListPage.css";

const VoucherListPage = () => {
  return (
    <div id="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <VoucherList />
      </div>
    </div>
  );
};

export default VoucherListPage;

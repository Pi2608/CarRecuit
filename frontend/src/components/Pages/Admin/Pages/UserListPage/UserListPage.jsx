import "./UserListPage.css";
import UserList from "../../ContentItems/UserList/UserList";
import Navbar from "../../ContentItems/Navbar/Navbar";
import Sidebar from "../../ContentItems/Sidebar/Sidebar";

const UserListPage = () => {
  return (
    <div className="list">
        <Sidebar/>
        <div className="listContainer">
            <Navbar/>
            <UserList/>
            
        </div>
    </div>
  )
}

export default UserListPage
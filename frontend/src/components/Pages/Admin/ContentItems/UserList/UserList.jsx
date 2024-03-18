import "./UserList.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const UserList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const response = await axios.get("http://localhost:4000/user/");
      const userData = response.data;
      console.log(userData)
      setData(await totalTransactionUser(userData));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function totalTransactionUser(userData) {
    try {
      const updatedUsers = await Promise.all(
        userData.map(async (user) => {
          const response = await axios.get(`http://localhost:4000/user/transaction/total/${user.id}`);
          return { ...user, total: response.data.total };
        })
      );
      return updatedUsers;
    } catch (error) {
      console.error("Error fetching total transactions:", error);
    }
  }


  async function handleBan(id) {
    try {
      await axios.put(`http://localhost:4000/user/editStatus?userId=${id}&status=0`); 
      fetchUser();
    } catch (error) {
      
    }
  };

  return (
    <div id="user">
      <div className="userTitle">
        Danh sách người dùng
        <Link to="/users/new" className="link">
          Thêm mới
        </Link>
      </div>

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Mã số</TableCell>
              <TableCell className="tableCell">Tên</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">SĐT</TableCell>
              <TableCell className="tableCell">Tổng số tiền</TableCell>
              <TableCell className="tableCell">Trạng thái</TableCell>
              <TableCell className="tableCell">Point</TableCell>
              <TableCell className="tableCell">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell className="tableCell">{row.name}</TableCell>
                <TableCell className="tableCell">{row.email}</TableCell>
                <TableCell className="tableCell">{row.phone}</TableCell>
                <TableCell className="tableCell">{row.total}</TableCell>
                <TableCell className="tableCell">{row.status.toString()}</TableCell>
                <TableCell className="tableCell">{row.point}</TableCell>
                <TableCell>
                  <div className="cellAction">
                    <div
                      className="banButton"
                      onClick={() => handleBan(row.id)}
                      style={{ backgroundColor: row.buttonColor }}
                    >
                      Cấm
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
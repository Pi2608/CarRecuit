import "./UserList.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const UserList = () => {
  const rows = [
    {
      id: 1,
      name: "Tuyết",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "abc@gmail.com",
      phone: 94444444,
      depositAmount: 20225454884,
      point: 25,
    },
  ];
  const [data, setData] = useState(rows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  /*const handleDelete = (id) => {
    const updatedUsers = data.filter(item => item.id !== id);
    setData(updatedUsers);
  };*/
  const handleBan = (id) => {
    setData((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, banned: true };
          return { ...updatedItem, buttonColor: "lightGray" };
        }
        return item;
      });
    });
  };
  /* const handleBan = (userId) => {
    const updatedUsers = data.map(user => {
      if (user.id === userId) {
        const updateItem = { ...user, banned: true };
        return {...updateItem, buttonColor: "lightGray" };
      }
      return user;
    });
    setData(updatedUsers);
  };*/

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
              <TableCell className="tableCell">Hình ảnh</TableCell>
              <TableCell className="tableCell">Tên</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">SĐT</TableCell>
              <TableCell className="tableCell">Số tiền đã nạp</TableCell>
              <TableCell className="tableCell">Point</TableCell>
              <TableCell className="tableCell">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell>
                  <div className="cellWithImg">
                    <img className="cellImg" src={row.img} alt="avatar" />
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.name}</TableCell>
                <TableCell className="tableCell">{row.email}</TableCell>
                <TableCell className="tableCell">{row.phone}</TableCell>
                <TableCell className="tableCell">{row.depositAmount}</TableCell>
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
                    <div
                      className="deleteButton"
                      onClick={() => handleDelete(row.id)}
                    >
                      Xóa
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
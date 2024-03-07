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
import { Button, TextField } from "@mui/material";
import axios from "axios";
import Popup from "reactjs-popup";
import SettingsIcon from "@mui/icons-material/Settings";

export default function UserList() {
  /*const rows = [
    {
      id: 1,
      name: "Tuyết",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      email: "abc@gmail.com",
      phone: 94444444,
      depositAmount: 20225454884,
      point: 25,
    },
  ];*/
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [pageList, setPageList] = useState([]);

  const handleSwitchPage = (page) => {
    setPage(page);
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/user/`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetch data", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUser();
  }, []);

  useEffect(() => {}, [users]);

  const handleDelete = (id) => {
    setUsers(users.filter((item) => item.id !== id));
  };
  /*const handleDelete = (id) => {
    const updatedUsers = data.filter(item => item.id !== id);
    setData(updatedUsers);
  };*/
  const handleBan = (id) => {
    setUsers((prevData) => {
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
              <TableCell>
                <div className="font-bold text-lg">Mã số</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg">Tên</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg w-1/2">Email</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg">SĐT</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg">Số tiền đã nạp</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg">Point</div>
              </TableCell>
              <TableCell>
                <div className="font-bold text-lg">Hành động</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((row) => (
                <>
                  <TableRow>
                    <TableCell>
                      <div className="text-lg">{row.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg">{row.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate text-lg">{row.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg">{row.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg">{row.wallet}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-lg">{row.point}</div>
                    </TableCell>
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
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center my-4">
        {pageList.map((pg, index) => (
          <td key={index}>
            <div className="items-center">
              <Button
                variant={index + 1 === page ? "contained" : "outlined"}
                onClick={() => handleSwitchPage(index + 1)}
              >
                {index + 1}
              </Button>
            </div>
          </td>
        ))}
      </div>
    </div>
  );
}
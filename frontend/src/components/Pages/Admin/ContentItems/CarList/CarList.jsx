import "./CarList.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const CarList = () => {
  const [rows, setRows] = useState([])
  return (
    <div id="car">
      <div className="carTitle">
        Danh sách xe
        <Link to="/cars/new" className="link">
          Thêm mới
        </Link>
      </div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Mã số xe</TableCell>
              <TableCell className="tableCell">Tên chủ xe</TableCell>
              <TableCell className="tableCell">Hình ảnh</TableCell>
              <TableCell className="tableCell">Tên xe</TableCell>
              <TableCell className="tableCell">Ghế</TableCell>
              <TableCell className="tableCell">Hãng xe</TableCell>
              <TableCell className="tableCell">Mô hình</TableCell>
              <TableCell className="tableCell">Lượt thuê</TableCell>
              <TableCell className="tableCell">Bảng số xe</TableCell>
              <TableCell className="tableCell">Tình trạng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell className="tableCell">{row.username}</TableCell>
                <TableCell>
                  <div className="cellWithImg">
                    <img className="cellImg" src={row.img} alt="avatar" />
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.car}</TableCell>
                <TableCell className="tableCell">{row.seat}</TableCell>
                <TableCell className="tableCell">{row.brand}</TableCell>
                <TableCell className="tableCell">{row.model}</TableCell>
                <TableCell className="tableCell">
                  {row.numberOfRental}
                </TableCell>
                <TableCell className="tableCell">{row.clp}</TableCell>
                <TableCell className="tableCell">
                  <span className={`status ${row.status}`}>{row.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CarList;

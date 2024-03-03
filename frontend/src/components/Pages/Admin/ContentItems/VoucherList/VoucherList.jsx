import "./VoucherList.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const VoucherList = () => {
  const rows = [
    {
      id: 1,
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      discount: 20,
      startDate: 12,
      endDate: 13,
    },
  ];
  const [data, setData] = useState(rows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  return (
    <div id="voucher">
      <div className="voucherTitle">
        Danh sách vouchers
        <Link to="/voucher/new" className="link">
          Thêm mới
        </Link>
      </div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Mã voucher</TableCell>
              <TableCell className="tableCell">Hình ảnh</TableCell>
              <TableCell className="tableCell">Lượng giảm giá (x%)</TableCell>
              <TableCell className="tableCell">Ngày bắt đầu</TableCell>
              <TableCell className="tableCell">Ngày kết thúc</TableCell>
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
                <TableCell className="tableCell">{row.discount}</TableCell>
                <TableCell className="tableCell">{row.startDate}</TableCell>
                <TableCell className="tableCell">{row.endDate}</TableCell>
                <TableCell>
                  <div className="cellAction">
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

export default VoucherList;

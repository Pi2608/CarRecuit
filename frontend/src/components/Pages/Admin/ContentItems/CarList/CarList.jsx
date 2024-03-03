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
  /*const userColumns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "username",
      headerName: "Chủ xe",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.username}
          </div>
        );
      },
    },
    {
      field: "car",
      headerName: "Tên xe",
      width: 120,
    },

    {
      field: "seat",
      headerName: "Số ghế",
      width: 70,
    },
    {
      field: "brand",
      headerName: "Hãng xe",
      width: 120,
    },
    {
      field: "model",
      headerName: "Mô hình",
      width: 100,
    },
    {
      field: "numberOfRental",
      headerName: "Lượt thuê",
      width: 100,
    },
    {
      field: "clp",
      headerName: "Bảng số xe",
      width: 120,
    },
    {
      field: "status",
      headerName: "Tình trạng",
      width: 120,
      renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
    },
  

  ];

  //temporary data
  const userRows = [
    {
      id: 1,
      username: "Vinh",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      car: "BMW 55",
      seat: 4,
      brand: "BMW",
      model: "mn",
      numberOfRental: 3,
      clp: "50-N2 09050",
      status: "Active",
    },
  ];
  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  

  const actionColumn = [
    {
      field: "action",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Xóa
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="car">
      <div className="carTitle">
        Danh sách xe
        <Link to="/cars/new" className="link">
          Thêm mới
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );*/
  const rows = [
    {
      id: 1,
      username: "Vinh",
      img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      car: "BMW 55",
      seat: 4,
      brand: "BMW",
      model: "mn",
      numberOfRental: 3,
      clp: "50-N2 09050",
      status: "Active",
    },
  ];
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

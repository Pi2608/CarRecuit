import "./CarList.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const CarList = () => {
  const [rows, setRows] = useState([])
  useEffect(() => {
    fetchRows()
  }, [])
  async function fetchRows() {
    try {
      const response = await axios.get('http://localhost:4000/car/all')
      const carListData = response.data;
      // Create an array of promises for each image loading
      const imagePromises = carListData.map((car) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = car.imgUrl;
          img.onload = () => resolve({ ...car, loaded: true });
        });
      });
      // Wait for all images to be loaded before updating state
      const loadedCarList = await Promise.all(imagePromises);
      for (let car of loadedCarList){
        const response1 = await axios.get(`http://localhost:4000/user/${car.ownerId}`)
        car.ownerName = response1.data.name
        const response2 = await axios.get(`http://localhost:4000/rent/counting/${car.id}`)
        if(response2.data.rentCount == null){
          car.numberOfRental = 0
        }else{
          car.numberOfRental = response2.data.rentCount
        }
      }
      setRows(loadedCarList);
    } catch (error) {

    }
  }
  // const rows = [
  //   {
  //     id: 1,
  //     username: "Vinh",
  //     img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
  //     car: "BMW 55",
  //     seat: 4,
  //     brand: "BMW",
  //     model: "mn",
  //     numberOfRental: 3,
  //     clp: "50-N2 09050",
  //     status: "Active",
  //   },
  // ];
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
              <TableCell className="tableCell">Lượt thuê</TableCell>
              <TableCell className="tableCell">Bảng số xe</TableCell>
              <TableCell className="tableCell">Tình trạng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell className="tableCell">{row.ownerName}</TableCell>
                <TableCell>
                  <div className="cellWithImg">
                    <img className="cellImg" src={row.imgUrl} alt="avatar" />
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.name}</TableCell>
                <TableCell className="tableCell">{row.seats}</TableCell>
                <TableCell className="tableCell">
                  {row.numberOfRental}
                </TableCell>
                <TableCell className="tableCell">{row.CLP}</TableCell>
                <TableCell className="tableCell">
                  <span className={`status ${row.status}`}>{row.status ? "Active" : "non-Active"}</span>
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

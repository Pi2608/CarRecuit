import "./Statistic.css";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const Statistic = () => {
  const [selectedOption, setSelectedOption] = useState("day");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const rows = [
    {
      id: 1,
      carName: "BMW",
      rentalCount: 13,
    },
  ];

  return (
    <div id="statistic">
      <div className="statisticTitle">Danh sách xe được thuê</div>
      <div>
        <label>
          <input
            type="radio"
            value="day"
            checked={selectedOption === "day"}
            onChange={handleOptionChange}
          />
          Ngày
        </label>
        <label>
          <input
            type="radio"
            value="month"
            checked={selectedOption === "month"}
            onChange={handleOptionChange}
          />
          Tháng
        </label>
      </div>

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Tên xe</TableCell>
              <TableCell className="tableCell">Số lượng xe được thuê</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.carName}</TableCell>
                <TableCell className="tableCell">{row.rentalCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Statistic;

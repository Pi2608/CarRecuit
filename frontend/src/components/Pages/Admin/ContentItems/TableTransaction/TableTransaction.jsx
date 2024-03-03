import "./TableTransaction.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TableTransaction = () => {
  const rows = [
    {
      id: 1143155,
      car: "BMW",
      customer: "Văn A",
      date: "1 Tháng 1",
      amount: 785,
      method: "Thanh toán trực tuyến",
      status: "Duyệt",
    },
    {
      id: 2235235,
      car: "BMW",
      customer: "Văn B",
      date: "1 Tháng 1",
      amount: 900,
      method: "Thanh toán trực tuyến",
      status: "Chờ",
    },
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">Mã giao dịch</TableCell>
            <TableCell className="tableCell">Xe</TableCell>
            <TableCell className="tableCell">Khách hàng</TableCell>
            <TableCell className="tableCell">Ngày</TableCell>
            <TableCell className="tableCell">Số tiền</TableCell>
            <TableCell className="tableCell">Phương thức thanh toán</TableCell>
            <TableCell className="tableCell">Tình trạng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">{row.car}</TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.method}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableTransaction;

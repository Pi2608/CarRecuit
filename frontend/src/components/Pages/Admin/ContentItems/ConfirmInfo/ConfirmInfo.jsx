import "./ConfirmInfo.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const ConfirmInfo = () => {
  const rows = [
    {
      id: 1,
      name: "Vinh",
      cccd: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
      gplx: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    },
  ];

  return (
    <div id="confirm">
      <div className="confirmTitle">Xác nhận thông tin</div>

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Tên</TableCell>
              <TableCell className="tableCell">Ảnh CCCD/CMND</TableCell>
              <TableCell className="tableCell">Ảnh GPLX</TableCell>
              <TableCell className="tableCell">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.name}</TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={row.cccd} alt="CCCD/CMND" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={row.gplx} alt="GPLX" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="cellAction">
                    <div className="confirmButton">Xác nhận</div>
                    <div className="rejectButton">Từ chối</div>
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

export default ConfirmInfo;

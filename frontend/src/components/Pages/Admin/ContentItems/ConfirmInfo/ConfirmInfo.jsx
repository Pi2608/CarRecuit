import "./ConfirmInfo.css";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";


const ConfirmInfo = () => {
  const [NID, setNID] = useState([])
  const [NDL, setNDL] = useState([])
  const [togglePart, setTogglePart] = useState(true);

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response1 = await axios.get(`http://localhost:4000/user/NID`)
      setNID(response1.data)
      const response2 = await axios.get(`http://localhost:4000/user/NDL`)
      setNDL(response2.data)
    } catch (error) {

    }
  }
  
  const handleDate = (d) => {
    const date = new Date(d)
    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    // Format as "--/--/----"
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
  }

  return (
    <div id="confirm">
      <div className="confirmTitle">
        <div className="toggle-part">
          <div className={`choice ${togglePart ? 'active' : ''}`} onClick={() => setTogglePart(true)}>
            <p>CCCD</p>
          </div>
          <div className={`choice ${!togglePart ? 'active' : ''}`} onClick={() => setTogglePart(false)}>
            <p>GPLX</p>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} style={togglePart ?  {}: {display:"none"}} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Id</TableCell>
              <TableCell className="tableCell">Ảnh CCCD/CMND trước</TableCell>
              <TableCell className="tableCell">Ảnh CCCD/CMND Sau</TableCell>
              <TableCell className="tableCell">Thông tin</TableCell>
              <TableCell className="tableCell">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {NID.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={(row.imgs[0]?.id.includes("NIDF")) ? (row.imgs[0]?.url) : (row.imgs[1]?.url)} alt="CCCD/CMND" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={(row.imgs[0]?.id.includes("NIDB")) ? (row.imgs[0]?.url) : (row.imgs[1]?.url)} alt="GPLX" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Số CCCD/CMND : {row.NID}</p>
                    <p>Tên : {row.name}</p>
                    <p>Ngày/tháng/năm sinh : {handleDate(row.dateOfBirth)}</p>
                    <p>Quê quán : {row.native}</p>
                    <p>Địa chỉ : {row.address}</p>
                    <p>Ngày cấp : {handleDate(row.dateProvide)}</p>
                    <p>Nơi cấp : {row.provider}</p>
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
        <Table sx={{ minWidth: 650 }} style={togglePart ?  {display:"none"} : {}} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Tên</TableCell>
              <TableCell className="tableCell">Ảnh CCCD/CMND</TableCell>
              <TableCell className="tableCell">Ảnh GPLX</TableCell>
              <TableCell className="tableCell">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {NDL.map((row) => (
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

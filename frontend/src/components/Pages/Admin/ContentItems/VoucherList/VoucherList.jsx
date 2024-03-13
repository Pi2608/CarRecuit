import "./VoucherList.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const VoucherList = () => {
  
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(()=>{
    fetchVoucherInUse()
  },[])

  async function fetchVoucherInUse (){
    const response = await axios.get("http://localhost:4000/voucher/recommend")
    setData(response.data)
  }

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (id) => {
    setData(data.filter((item) => item.id !== id));
    await axios.put(`http://localhost:4000/voucher/delete/${id}`)
  };

  const fetchCreateVoucher = async (discountF, startDateF, endDateF) =>{
    try {
      const postData = {
        discount : discountF,
        startDate : startDateF,
        endDate : endDateF
      }
      await axios.post(`http://localhost:4000/voucher/create`, postData)
    } catch (error) {
      
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu đã nhập ở đây
    fetchCreateVoucher(discount, startDate, endDate)
    // Sau khi xử lý xong, có thể đóng popup
    togglePopup();
  };
  return (
    <div id="voucher">
      <div className="voucherTitle">
        Danh sách vouchers
        <button className="head" onClick={togglePopup}>Open Popup</button>
        {isOpen && (
          <div className="popup-content">
            <div className="popup-inner">
              <div onClick={togglePopup} style={{cursor: 'pointer'}}>x</div>
              <form onSubmit={handleSubmit}>
                <label>
                  <h4 className="labelPopup">Discount:</h4>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </label>
                <label>
                  <h4 className="labelPopup">Start Date:</h4>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label>
                  <h4 className="labelPopup">End Date:</h4>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Mã voucher</TableCell>
              <TableCell className="tableCell">Lượng giảm giá (x%)</TableCell>
              <TableCell className="tableCell">Ngày bắt đầu</TableCell>
              <TableCell className="tableCell">Ngày kết thúc</TableCell>
              <TableCell className="tableCell">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.voucherCode}</TableCell>
                <TableCell className="tableCell">{parseFloat(row.discount) * 100}</TableCell>
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

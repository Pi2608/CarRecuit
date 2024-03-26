import "./ConfirmInfo.css";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from "axios";
import Popup from 'reactjs-popup';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React from "react";


const ConfirmInfo = () => {
  const [NID, setNID] = useState([])
  const [NDL, setNDL] = useState([])
  const [Cars, setCars] = useState([])
  const [togglePart, setTogglePart] = useState('NID');
  const [itemImg, setImgData] = useState([{
    img: '',
    title: '',
  }]);
  const [carDetail, setCarDetail] = useState('')
  const [amenities, setAmenities] = useState([])
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response1 = await axios.get(`http://localhost:4000/user/NID`)
      setNID(response1.data)
      const response2 = await axios.get(`http://localhost:4000/user/NDL`)
      setNDL(response2.data)
      await getRequest()
    } catch (error) {

    }
  }

  async function getRequest(){
    try {
      const response = await axios.get(`http://localhost:4000/car/request`)
      setCars(response.data)
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
  async function editStatusNID(NIDId, status) {
    try {
      await axios.put(`http://localhost:4000/user/NID/editStatus?NIDId=${NIDId}&status=${status}`)
      fetchData()
    } catch (error) {

    }
  }
  async function editStatusNDL(NDLId, status) {
    try {
      await axios.put(`http://localhost:4000/user/NDL/editStatus?NDLId=${NDLId}&status=${status}`)
      fetchData()
    } catch (error) {

    }
  }

  const fetchCarDetail = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/car/${id}`);
      return response.data; // Assuming response.data contains car details
    } catch (error) {
      console.error("Error fetching car details:", error);
      return null;
    }
  };

  const handlePopupOpen = async (id) => {
    try {
      const car = await fetchCarDetail(id)
      console.log(car[0])
      setCarDetail(car[0])
      setAmenities(car[2])
      const images = car[1]; // Assuming images are returned directly from API
      // Ensure that the images are received correctly
      // Clear previous images
      console.log(carDetail)
      setImgData([2]);

      // Add new images to the state
      const newImages = images.map((image) => ({
        img: image.url,
        title: image.id
      }));
      setImgData(newImages);
      setPopupOpen(true);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };


  const hanldeButtonClick = async (carId, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/car/request/edit?carId=${carId}&status=${status}`);
      // Create a promise that resolves with the response data
      const responseDataPromise = new Promise((resolve) => {
        resolve(response.data);
      });
      // Wait for the promise to resolve
      await responseDataPromise;
      console.log(response.data)

      await getRequest()
      // After the promise resolves, close the popup
      setPopupOpen(false);

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div id="confirm">
      <div className="confirmTitle">
        <div className="toggle-part">
          <div className={`choice ${togglePart === 'NID' ? 'active' : ''}`} onClick={() => setTogglePart('NID')}>
            <p>CCCD</p>
          </div>
          <div className={`choice ${togglePart === 'NDL' ? 'active' : ''}`} onClick={() => setTogglePart('NDL')}>
            <p>GPLX</p>
          </div>
          <div className={`choice ${togglePart === 'Car' ? 'active' : ''}`} onClick={() => setTogglePart('Car')}>
            <p>Xe</p>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} style={togglePart === 'NID' ? {} : { display: "none" }} aria-label="simple table">
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
                    <img className="cellWImg" src={(row.imgs[0]?.id.includes("NIDF")) ? (row.imgs[0]?.url) : (row.imgs[1]?.url)} alt="Image" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={(row.imgs[0]?.id.includes("NIDB")) ? (row.imgs[0]?.url) : (row.imgs[1]?.url)} alt="Image" />
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
                    <Stack spacing={3} direction="row">
                      <Button variant="outlined" onClick={() => editStatusNID(row.id, 1)}>Xác nhận</Button>
                      <Button variant="outlined" onClick={() => editStatusNID(row.id, 0)}>Từ chối</Button>
                    </Stack>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table sx={{ minWidth: 650 }} style={togglePart === 'NDL' ? {} : { display: "none" }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Id</TableCell>
              <TableCell className="tableCell">Ảnh GPLX</TableCell>
              <TableCell className="tableCell">Thông tin</TableCell>
              <TableCell className="tableCell">Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {NDL.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">{row.id}</TableCell>
                <TableCell>
                  <div className="cellImg">
                    <img className="cellWImg" src={row.imgs[0]?.url} alt="Image" />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>Tên : {row.name}</p>
                    <p>Số GPLX : {row.NDL}</p>
                    <p>Ngày/tháng/năm sinh : {handleDate(row.dateOfBirth)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="cellAction">
                    <Stack spacing={3} direction="row">
                      <Button variant="outlined" onClick={() => editStatusNDL(row.id, 1)}>Xác nhận</Button>
                      <Button variant="outlined" onClick={() => editStatusNDL(row.id, 0)}>Từ chối</Button>
                    </Stack>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table sx={{ minWidth: 650 }} style={togglePart === 'Car' ? {} : { display: "none" }} aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">Id</TableCell>
              <TableCell className="tableCell">Ảnh xe</TableCell>
              <TableCell className="tableCell">Giá</TableCell>
              <TableCell className="tableCell">Loại xe</TableCell>
              <TableCell className="tableCell">Chủ xe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Cars.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow onClick={() => handlePopupOpen(row.id)}>
                  <TableCell className="tableCell">{row.id}</TableCell>
                  <TableCell className="tableCell">
                    <div className="cellImg">
                      <img className="cellWImg" src={row.imgUrl} alt="Image" />
                    </div>
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell className="tableCell">{row.name}</TableCell>
                  <TableCell className="tableCell">{row.userName}</TableCell>
                </TableRow>
                <Popup
                  key={row.id}
                  open={popupOpen}
                  // onClose={() => setPopupOpen(false)}
                  contentStyle={{
                    height: '60vh',
                    width: '60%',
                    borderRadius: "10px",
                    backgroundColor: 'white',
                    padding: '2em',
                  }}
                  modal
                >
                  {(close) => (
                    <div id="popup-content-car">
                      <div className="popup-inner">
                        <div className="exit-btn" onClick={close} style={{ cursor: 'pointer' }}><CloseIcon style={{ height: "17px" }} /></div>
                        <ImageList sx={{ width: 500, height: 600 }} variant="woven" cols={1} gap={5}>
                          {itemImg.map((item) => (
                            <ImageListItem key={item.img}>
                              <img
                                srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item.img}?w=161&fit=crop&auto=format`}
                                alt={item.title}
                                loading="lazy" />
                            </ImageListItem>
                          ))}
                        </ImageList>
                        <Box
                          component="form"
                          sx={{
                            '& .MuiTextField-root': { m: 1, width: '27ch' }
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
                            <TextField
                              id="outlined-read-only-input"
                              label="Name"
                              defaultValue={carDetail.name}
                              InputProps={{
                                readOnly: true,
                              }} />
                            <TextField
                              id="outlined-read-only-input"
                              label="Biển số xe"
                              defaultValue={carDetail.CLP}
                              InputProps={{
                                readOnly: true,
                              }} />
                            <TextField
                              id="outlined-read-only-input"
                              label="Giá"
                              defaultValue={carDetail.price}
                              InputProps={{
                                readOnly: true,
                              }} />
                            <TextField
                              id="outlined-read-only-input"
                              label="Số chỗ"
                              defaultValue={carDetail.seats}
                              InputProps={{
                                readOnly: true,
                              }} />
                            <TextField
                              id="outlined-read-only-input"
                              label="Truyền động"
                              defaultValue={carDetail.gearStick}
                              InputProps={{
                                readOnly: true,
                              }} />
                            <TextField
                              id="outlined-read-only-input"
                              label="Loại nhiên liệu"
                              defaultValue={carDetail.typeOfFuels}
                              InputProps={{
                                readOnly: true,
                              }} />
                          </div>
                          <Box
                            component="form"
                            sx={{
                              '& .MuiTextField-root': { m: 1, width: '56ch' },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="outlined-read-only-input"
                              label="Mô tả"
                              defaultValue={carDetail.description}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Box>
                          <div id="amenities-contain">
                            {amenities.map((amenity) => (
                              <div id="toggle-btn-ad" key={amenity.id}>
                                <label className="amenity">
                                  <div className="amenity" >
                                    {amenity.id === 1 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/map-v2.png"></img>}
                                    {amenity.id === 2 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/bluetooth-v2.png"></img>}
                                    {amenity.id === 3 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/360_camera-v2.png"></img>}
                                    {amenity.id === 4 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/parking_camera-v2.png"></img>}
                                    {amenity.id === 5 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/dash_camera-v2.png"></img>}
                                    {amenity.id === 6 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/reverse_camera-v2.png"></img>}
                                    {amenity.id === 7 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/tpms-v2.png"></img>}
                                    {amenity.id === 8 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/impact_sensor-v2.png"></img>}
                                    {amenity.id === 9 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/head_up-v2.png"></img>}
                                    {amenity.id === 10 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/sunroof-v2.png"></img>}
                                    {amenity.id === 11 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/gps-v2.png"></img>}
                                    {amenity.id === 12 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/babyseat-v2.png"></img>}
                                    {amenity.id === 13 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/usb-v2.png"></img>}
                                    {amenity.id === 14 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/spare_tire-v2.png"></img>}
                                    {amenity.id === 15 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/dvd-v2.png"></img>}
                                    {amenity.id === 16 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/bonnet-v2.png"></img>}
                                    {amenity.id === 17 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/etc-v2.png"></img>}
                                    {amenity.id === 18 && <img src="https://n1-cstg.mioto.vn/v4/p/m/icons/features/airbags-v2.png"></img>}
                                    <p>{amenity.name}</p>
                                  </div>
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="popup-buttons"> {/* Container for the buttons */}
                            <Stack direction="row" spacing={2}>
                              <Button variant="contained" onClick={()=>{hanldeButtonClick(carDetail.id, 1)}} style={{ backgroundColor: 'green' }}>Chấp nhận</Button>
                              <Button variant="contained" onClick={()=>{hanldeButtonClick(carDetail.id, 0)}} style={{ backgroundColor: 'red' }}>Từ chối</Button>
                            </Stack>
                          </div>
                        </Box>
                      </div>
                    </div>
                  )}
                </Popup>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ConfirmInfo;

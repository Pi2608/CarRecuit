import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../../Context/AuthProvider'
import { MenuItem, TextField } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Header from '../../../../../Items/Header/Header'
import Footer from '../../../../../Items/Footer/Footer'
import axios from 'axios'
import "./CarRegister.css"

export default function CarRegister() {

    const { auth , id } = useAuth()
    
    const fileInputRef = useRef(null);
    const navigation = useNavigate();

    const currentYear = new Date().getFullYear();

    const [ brandList, setBrandList ] = useState([]);
    const [ modelList, setModelList ] = useState([]);
    const [ amenities,  setAmenities ] = useState([]);
    const [ provinceList, setProvinceList ] = useState([]);
    const [ districtList, setDistrictList ] = useState([]);
    const [ townList, setTownList ] = useState([]);
    const [ numberOfImages, setNumberOfImages ] = useState(0);

    const [ carBrand, setCarBrand ] = useState("");

    const [ carModel, setCarModel ] = useState("");
    const [ CLP, setCLP ] = useState("");
    const [ carPrice, setCarPrice ] = useState("");
    const [ carDescription, setCarDescription ] = useState("");
    const [ carSeats, setCarSeats ] = useState("");
    const [ carYear, setCarYear ] = useState("");
    const [ carGearStick, setCarGearStick ] = useState("");
    const [ carFuel, setCarFuel ] = useState("");
    const [ selectedAmenities, setSelectedAmenities ] = useState([]);
    const [ ldescription, setLdescription ] = useState("");
    const [ imageFiles, setImageFiles ] = useState([])
    const [ long, setLong ] = useState("");
    const [ lat, setLat ] = useState("");

    const [address, setAddress ] = useState("");
    const [ province, setProvince ] = useState([])  
    const [ district, setDistrict ] = useState([])  
    const [ town, setTown ] = useState([]) 

    function handleAmenityToggle(amenityId){
        if (selectedAmenities.includes(amenityId)) {
          setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
        } else {
          setSelectedAmenities([...selectedAmenities, amenityId]);
        }
    }

    async function getAmenities() {
        try {
          const response = await axios.get('http://localhost:4000/amenities/');
          const data = response.data;
          setAmenities(data); 
        } catch (error) {
          console.error('Error fetching amenities: ', error);
        }
    }

    async function getBrand(){
        try {
            const response = await axios.get('http://localhost:4000/car/brand/');
            const data = response.data;
            setBrandList(data)
        } catch (error) {   
            console.error('Error fetching car brand: ', error);
        }
    }
    
    async function getModel(brandId){
        try {
            const response = await axios.get(`http://localhost:4000/car/type/brand/${brandId}`);
            const data = response.data;
            setModelList(data)
        } catch (error) {   
            console.error('Error fetching car brand: ', error);
        }
    }
    
    async function getProvince(){
        try {
            const response = await axios.get(`https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100`);
            const data = response.data;
            setProvinceList(data.results)
        } catch (error) {   
            console.error('Error fetching Province: ', error);
        }
    }
    
    async function getDistrict(ID){
        try {
            const response = await axios.get(`https://vnprovinces.pythonanywhere.com/api/districts/?province_id=${ID}&basic=true&limit=100`);
            const data = response.data;
            setDistrictList(data.results)
        } catch (error) {   
            console.error('Error fetching District: ', error);
        }
    }
    
    async function getTown(ID){
        try {
            const response = await axios.get(`https://vnprovinces.pythonanywhere.com/api/wards/?district_id=${ID}&basic=true&limit=100`);
            const data = response.data;
            setTownList(data.results)
        } catch (error) {   
            console.error('Error fetching Town: ', error);
        }
    }

    async function getCoordinates(town, province){
        try {
            let adminDistrict = province.name_en;
            adminDistrict = adminDistrict.replace(/\s/g, "");
            let locality = town.name_en;
            locality = locality.replace(/\s/g, "");
            const response = await axios.get(`https://dev.virtualearth.net/REST/v1/Locations?countryRegion=Vietnam&adminDistrict=${adminDistrict}&locality=${locality}&key=AltSuzYz6AIayrHDpBHevjM07c-5ek_OrHnF7FFpjdqgSD5Fu80lolUut7ssLfCz`);
            const data = response.data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
            setLat(data[0])
            setLong(data[1])
            console.log(lat +", "+long);
        } catch (error) {
            console.error('Error fetching Coordinates: ', error);
        }
    }
    
    useEffect(() => {
        const fetchData = async () => {
            await getBrand();
            await getAmenities();
            await getProvince();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (carBrand) {
            console.log(carBrand);
            getModel(carBrand);
        }
    }, [carBrand]);

    useEffect(() => {
        console.log(selectedAmenities);
    },[selectedAmenities])

    useEffect(() => {
            getDistrict(province.id);
    },[province]);

    useEffect(() => {
            getTown(district.id);
    },[district]);

    useEffect(() => {
            getCoordinates(town, province);
    },[town])

    useEffect(() => {
        console.log(imageFiles)
    },[imageFiles])

    const getLdescription = () => {
        const combineString = `${address}, ${town.full_name}, ${district.full_name}, ${province.full_name}`
        setLdescription(combineString)
    }

    const registCar = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('carTypeId', carModel);
            formData.append('CLP', CLP);
            formData.append('price', carPrice);
            formData.append('description', carDescription);
            formData.append('seats', carSeats);
            formData.append('year', carYear);
            formData.append('gearStick', carGearStick);
            formData.append('typeOfFuels', carFuel);
            formData.append('ldescription', ldescription);
            formData.append('amenities', JSON.stringify(selectedAmenities));
            // Append images to FormData
            for (let i = 0; i < imageFiles.length; i++) {
                formData.append(`images`, imageFiles[i]);
            }
            const response = await axios.post(`http://localhost:4000/car/new/${id}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(formData);
            alert('Car registered successfully!');
            navigation("/user/mycars")
        } catch (error) {
            console.log("Error registering car: " + error.message);
        }
    }

    const handleInputImages = (e) => {
        try {
            if (numberOfImages < 4) {
                const images = e.target.files;
                if (!images) {
                    throw new Error("No file selected");
                }
                setImageFiles(prevFiles => [...prevFiles, ...images]);
                setNumberOfImages(prev => prev + 1)
            }
        } catch (error) {
            console.error("Error handling input images:", error);
        }
    }

    return(
        <div id="carregister">
            <Header />
            <form className="body" onSubmit={registCar}>
                <h1 style={{paddingBottom: "1em"}}>Đăng kí xe</h1>
                <div className="form-container">
                    <label htmlFor="CLP">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Biển số xe</p>
                        <p style={{color:"red"}}>Lưu ý: Biển số sẽ không thể thay đổi sau khi đăng kí.</p>
                        <br />
                        <TextField 
                            id='CLP'
                            size="small"
                            sx={{
                                width: "400px",
                            }}
                            onChange={(e) => setCLP(e.target.value)}
                            value={CLP}
                            required
                            />  
                    </label>
                    <br />
                    <br />
                    <div className="info-section">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Thông tin cơ bản</p>
                        <p style={{color:"red"}}>Lưu ý: Các thông tin cơ bản sẽ không thể thay đổi sau khi đăng kí.</p>
                        <br />
                        <div className="car-info">
                            <label htmlFor="car-brand">
                                <p>Hãng xe</p>
                                <TextField 
                                id='car-brand'
                                select 
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarBrand(e.target.value)}
                                value={carBrand}
                                required
                                >
                                    {brandList?.map((brand) =>(
                                    <MenuItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </label>
                            <label htmlFor="car-model">
                                <p>Mẫu xe</p>
                                <TextField 
                                id='car-model'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarModel(e.target.value)}
                                value={carModel}
                                required
                                >
                                    {modelList?.map((model) =>(
                                    <MenuItem key={model.id} value={model.id}>
                                        {model.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            </label>
                            <label htmlFor="car-seat">
                                <p>Số ghế</p>
                                <TextField 
                                id='car-seat'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarSeats(e.target.value)}
                                value={carSeats}
                                required
                                >
                                    <MenuItem value="4">
                                        4
                                    </MenuItem>
                                    <MenuItem value="7">
                                        5
                                    </MenuItem>
                                    <MenuItem value="16">
                                        6
                                    </MenuItem>
                                    <MenuItem value="24">
                                        7
                                    </MenuItem>
                            </TextField>
                            </label>
                            <label htmlFor="car-year">
                                <p>Năm sản xuất</p>
                                <TextField 
                                id='car-year'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarYear(e.target.value)}
                                value={carYear}
                                required
                                >
                                    {Array.from({ length: currentYear - 1999 }, (_, index) => {
                                        const year = currentYear - index;
                                        return (
                                            <MenuItem value={year.toString()}>
                                                {year}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            </label>
                            <label htmlFor="car-gear-stick">
                                <p>Truyền động</p>
                                <TextField 
                                id='car-gear-stick'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarGearStick(e.target.value)}
                                value={carGearStick}
                                required
                                >
                                    <MenuItem value="Số tự động">
                                        Số tự động
                                    </MenuItem>
                                    <MenuItem value="Số sàn">
                                        Số sàn
                                    </MenuItem>
                                </TextField>
                            </label>
                            <label htmlFor="car-fuel">
                                <p>Loại nhiên liệu</p>
                                <TextField 
                                id='car-fuel'
                                select
                                size="small"
                                sx={{
                                    width: "300px",
                                }}
                                onChange={(e) => setCarFuel(e.target.value)}
                                value={carFuel}
                                required
                                >
                                    <MenuItem value="Xăng">
                                        Xăng
                                    </MenuItem>
                                    <MenuItem value="Dầu diesel">
                                        Dầu diesel
                                    </MenuItem>
                                    <MenuItem value="Điện">
                                        Điện
                                    </MenuItem>
                                </TextField>
                            </label>
                        </div>
                        <br />
                        <label htmlFor="description">
                            <p style={{fontWeight: "500", fontSize: "18px"}}>Mô tả</p>
                            <TextField
                                id='description'
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => setCarDescription(e.target.value)}
                                value={carDescription}
                            />
                        </label>
                        <br />
                        <br />
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Các tính năng</p>
                        <br />
                        <div className="amenity-container">
                            {amenities.map((amenity) => (
                                <div className="toggle-btn" key={amenity.id}>
                                    <label className={`amenity ${selectedAmenities.includes(amenity.id) ? 'selected' : ''}`}>
                                        <div className="amenity" style={(selectedAmenities.includes(amenity.id)) ? {border: "1px solid #5fcf86", backgroundColor: "#C4FFD0"} : {border: "1px solid #ccc"}}>
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
                                            <input
                                            type="checkbox"
                                            checked={selectedAmenities.includes(amenity.id)}
                                            onChange={() => handleAmenityToggle(amenity.id)}
                                            />
                                        </div>
                                    </label>
                                </div>
                            ))}             
                        </div>
                    </div>
                    <br /><br />
                    <div className="renting-section">
                        <label htmlFor="car-price">
                            <p style={{fontWeight: "500", fontSize: "18px"}}>Đơn giá xe mặc định</p>
                            <p>Đơn giá áp dụng cho tất cả các ngày. Bạn có thuể tuỳ chỉnh giá trong mục quản lý xe sau khi đăng kí.</p>
                            <p>Giá đề xuất: 800K</p>
                            <br />
                            <div style={{display: "flex",alignItems: "center"}}>
                                <TextField
                                    id="car-price"
                                    type="number"
                                    size="small"
                                    sx={{
                                        width: "300px",
                                    }}
                                    onChange={(e) => setCarPrice(e.target.value)}
                                    value={carPrice}
                                />
                                <p>K</p>
                            </div>
                        </label>
                    </div>
                    <br />
                    <div className="address-section">
                        <label htmlFor="car-address">
                            <p style={{fontWeight: "500", fontSize: "18px"}}>Địa chỉ xe</p>
                            <div style={{display: "flex", paddingBottom: "20px", borderRadius: "5px", justifyContent: "space-between"}}>
                                <p>Địa chỉ mặc định để giao, nhận xe</p>
                            </div>
                            <div style={{display: "flex", flexDirection: 'column'}}>
                                <TextField
                                    select
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                    label="Chọn tỉnh"
                                    size="small"
                                >
                                    {provinceList?.map((prov) =>(
                                        <MenuItem value={prov}>
                                            {prov.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <br />
                                <TextField
                                    select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    label="Chọn huyện"
                                    size="small"
                                    disabled={districtList.length === 0}
                                >
                                    {districtList?.map((dist) => (
                                        <MenuItem value={dist}>
                                            {dist.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <br />
                                <TextField
                                    select
                                    value={town}
                                    onChange={(e) => setTown(e.target.value)}
                                    label="Chọn xã"
                                    size="small"
                                    disabled={townList.length === 0}
                                >
                                    {townList?.map((town) => (
                                        <MenuItem value={town}>
                                            {town.name}
                                        </MenuItem>
                                    ))}
                                </TextField> 
                                <br />
                                <TextField
                                    size="small"
                                    label="Địa chỉ"
                                    value={address}
                                    onChange={(e) => {setAddress(e.target.value); getLdescription()}}
                                    disabled={town === null}
                                />
                                <br />
                                <p>Địa chỉ: {ldescription ? ldescription : ""}</p>
                            </div>
                        </label>
                    </div>
                    <br />
                    <div className="images-section">
                        <p style={{fontWeight: "500", fontSize: "18px"}}>Hỉnh ảnh xe</p>
                        <p>Đăng nhiều hình ở các góc độ khác nhau để tăng thông tin cho xe của bạn</p>
                        <br />
                        <div className="image-container">
                            <label className="add-img-btn">
                                <div className="container">
                                    <AddCircleRoundedIcon style={{height: "32px", width: "auto"}}/>
                                </div>
                                <input 
                                    type="file"
                                    ref={fileInputRef}
                                    accept='.png, .jpg'
                                    style={{display: "none"}}
                                    onChange={handleInputImages}
                                />
                            </label>
                            {imageFiles.length > 0 && (
                                imageFiles.map((file, index) => (
                                    <div className="img-container">
                                            <div className="img-ctn">
                                                <img 
                                                    key={index}
                                                    src={URL.createObjectURL(file)}
                                                    style={{ width: "100%", height: "auto", borderRadius: "25px"}}
                                                    alt={`Image ${index}`}
                                                    required
                                                />
                                            </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <button 
                        type="submit"
                        style={{width: "100%", padding: "15px", border: "none", backgroundColor: "#5fcf86", color: "white", borderRadius: "5px", fontWeight: "500"}}
                        onMouseOver={(e) => {e.target.style.backgroundColor = "#469963"}}
                        onMouseLeave={(e) => {e.target.style.backgroundColor = "#5fcf86"}}
                    >Đăng kí
                    </button>
                </div>
            </form>
            <Footer />
        </div>
    )
}
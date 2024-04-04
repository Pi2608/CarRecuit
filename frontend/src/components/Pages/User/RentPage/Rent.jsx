import React,{ useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../../../../Context/AuthProvider";
import Header from "../../../Items/Header/Header";
import Footer from "../../../Items/Footer/Footer";
import "./Rent.css"
import { tr } from "date-fns/locale";

export default function Rent(){

    const { auth, id } = useAuth();

    const [ carList, setCarList ] = useState([]);
    const [ totalP, setTotalP ] = useState(0);

    const getRentCars = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/rent/detailCurrent/${id}`);
            const data = response.data;
            setCarList(data);
        } catch (error) {
            console.error("Error fetching rent car:" + error)
        }
    }

    async function sendRentRequest(){
        try {
            const response = await axios.get(`http://localhost:4000/rent/confirmPayment/${id}`);
            const data = response.data;
            console.log(data);
            await getRentCars();
            setTotalP(0);
        } catch (error) {
            console.error("Error payment: " + error)
        }
    }

    async function removeCar(rentId){
        try {
            const response = await axios.get(`http://localhost:4000/rent/deleteCar?userId=${id}&rentDetailId=${rentId}`);
            const data = response.data;
            console.log("run");
            await getRentCars();
            totalPrice()
        } catch (error) {
            console.error("Error undo adding car: " + error)
        }
    }

    useEffect(()=>{
        const fetchData = async () =>{
            await getRentCars();
        }
        if (auth) {
            fetchData();
        }
    },[])

    useEffect(()=>{
        if (carList.length > 0) {
            totalPrice();
        }
    },[carList])

    function handleDateTime(d) {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDateTime;
    }

    function displayPeriod(startDate, endDate){
        const tempStartDate = handleDateTime(startDate);
        const tempEndDate = handleDateTime(endDate);
        const rs = `${tempStartDate} - ${tempEndDate}`;
        return rs
    }

    function totalPrice(){
        let total = 0;
        for (let i = 0; i < carList.length; i++) {
            console.log(`${i}` + carList[i].total)
            total += carList[i].total;
        }
        setTotalP(parseInt(total))
    }

    return (
        <div id="rent-page">
            <Header/>
            <div className="body">
                <div className="car-list">
                    <table style={{width: "100%"}}>
                        <thead>
                            <th>Stt</th>
                            <th>Xe</th>
                            <th>Thời gian thuê</th>
                            <th>Tổng thanh toán</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {carList?.map((car, index) => 
                                <tr key={car.id}>
                                    <td>{index}</td>
                                    <td>{car?.name || " "}</td>
                                    <td>{displayPeriod(car.pick_up, car.drop_off)}</td>
                                    <td>{car.total}</td>
                                    <td><div className="delete-btn" onClick={()=>removeCar(car.id)}><DeleteIcon/></div></td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Tổng: {totalP}K</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="pay-btn" onClick={() => {sendRentRequest()}}>Thanh toán</div>
            </div>
            <Footer/>
        </div>
    )
}
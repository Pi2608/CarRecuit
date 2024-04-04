import React from "react";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthProvider";
import axios from "axios";
import "./Cart.css"

export default function CartButon(){

    const { auth, id } = useAuth()

    const navigate = useNavigate()

    // async function getCart(){
    //     try {
    //         const response = await axios.get(`http://localhost:4000/rent/detailCurrent/${id}`)
    //     } catch (error) {
            
    //     }
    // }

    return(
        <div id="cart-btn" onClick={() => navigate("/rent")} onmo>
            <ShoppingCartOutlinedIcon 
                style={{backgroundColor: "#fff", padding: "10px", borderRadius: "50px", border: "solid 1px #ccc"}}
                onMouseEnter = {(e)=>e.target.style.backgroundColor = "#ccc"}
                onMouseLeave = {(e)=>e.target.style.backgroundColor = "#fff"}
            />
        </div>
    )
}
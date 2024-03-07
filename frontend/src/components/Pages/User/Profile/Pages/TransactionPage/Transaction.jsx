import React, { useEffect } from "react";
import Header from "../../../../../Items/Header/Header";
import Footer from "../../../../../Items/Footer/Footer";
import MyTransaction from "../../Profile items/Content items/MyTransaction/MyTransaction";
import './Transaction.css'
export default function Transaction(){
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);
    return(
        <div id="transaction">
            <Header/>
            <div className="body">
                <div className="transaction-form">
                    <MyTransaction/>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import CarImage from "./images/Hyundai-accent-2022-1.jpg"
import axios from "axios";
import "./image.css"

export default function Image(){

    const [car, setCar] = useState([])
    const [imgList, setImgList] = useState([])
    const [imgInfo, setImgInfo] = useState([])

    async function getCar(){
        try {
            const reponse = await axios.get(`http://localhost:4000/car/1`)
            setCar(reponse.data)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    useEffect(() => {
        getCar()
    },[])
    
    useEffect(() => {
        if (car) {
            // console.log('car:', car[1])
            setImgList(car[1])
            if (imgList) {
                // console.log('imgList:', imgList[0])
                setImgInfo(imgList[0])
                // if (imgInfo) {
                //     console.log('imgInfo:', imgInfo.url)
                // }
            }
        }else {
            console.log('hihi')
        }
    },[car, imgList])

    return(
        <div id="img">
            <div className="container">
                {imgInfo ? 
                    <img src={imgInfo.url} alt="Hyundai-accent-2022" />: <div>there's nothing here</div>
                }
            </div>
        </div>
    )
}
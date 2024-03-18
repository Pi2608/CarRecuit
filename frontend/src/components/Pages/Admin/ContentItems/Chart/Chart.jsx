import { useEffect, useState } from "react";
import "./Chart.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";



const Chart = ({ aspect, title, type }) => {
  const [tripData,setTripData] = useState([]);
  const [earningData,setEarningData] = useState([]);
  const [data,setData]= useState([]);
  useEffect(()=>{
    fetchDataRent()
    },[])

  useEffect(()=>{
    if (type) {
      setData(tripData)
    }else{
      setData(earningData)
    }
  },[type])
  async function fetchDataRent (){
    try {
      const postData = {
        year : 2024
      }

      const  response1 = await axios.post('http://localhost:4000/rent/statistic', postData)
      const  response2 = await axios.post('http://localhost:4000/rent/earning/statistic', postData)

      let dataReturn1 = [
        {name:"T1", Total:parseInt(response1.data.T1)},
        {name:"T2", Total:parseInt(response1.data.T2)},
        {name:"T3", Total:parseInt(response1.data.T3)},
        {name:"T4", Total:parseInt(response1.data.T4)},
        {name:"T5", Total:parseInt(response1.data.T5)},
        {name:"T6", Total:parseInt(response1.data.T6)},
        {name:"T7", Total:parseInt(response1.data.T7)},
        {name:"T8", Total:parseInt(response1.data.T8)},
        {name:"T9", Total:parseInt(response1.data.T9)},
        {name:"T10", Total:parseInt(response1.data.T10)},
        {name:"T11", Total:parseInt(response1.data.T11)},
        {name:"T12", Total:parseInt(response1.data.T12)}
      ]
      setTripData(dataReturn1)

      let dataReturn2 = [
        {name:"T1", Total:parseInt(response2.data.T1)},
        {name:"T2", Total:parseInt(response2.data.T2)},
        {name:"T3", Total:parseInt(response2.data.T3)},
        {name:"T4", Total:parseInt(response2.data.T4)},
        {name:"T5", Total:parseInt(response2.data.T5)},
        {name:"T6", Total:parseInt(response2.data.T6)},
        {name:"T7", Total:parseInt(response2.data.T7)},
        {name:"T8", Total:parseInt(response2.data.T8)},
        {name:"T9", Total:parseInt(response2.data.T9)},
        {name:"T10", Total:parseInt(response2.data.T10)},
        {name:"T11", Total:parseInt(response2.data.T11)},
        {name:"T12", Total:parseInt(response2.data.T12)}
      ]
      setEarningData(dataReturn2)
      setData(dataReturn1)
    } catch (error) {
      
    }
  }

  return (
    <div id="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
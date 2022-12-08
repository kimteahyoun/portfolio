import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Chart from 'react-google-charts';
import {UserContext} from '../context/UserContext'




const MySellListChart = () => {
    const { loginUser } = useContext(UserContext);
    const [data, setData] = useState('');
    const chartType = useRef('Bar');

    const options = {
        title: title.current,
        lineWidth: 4,
        curveType: "function",

    };

   

    const callChart = async () => {
        //fetch data from db + put it in state variable
        let result = await axios.get(`/api/tradeinfo/sell/chart?seller=${loginUser.unickname}`);
        let array = changeData(result.data);
        setData(array);
    }

    const changeData = (result) => {
        title.current = '2022 월별 판매 총액';
        chartType.current = 'LineChart';

        let array = [];
        array.push(['월', '총액']);
        result.forEach(item => {
            array.push([item.month, item.payprice]);
        });
        return array;
    }

  console.log(data);



    useEffect(() => {
        callChart();
    },[])

    return (
        <div style={{marginTop:100}}>
            <Chart
                chartType={chartType.current}
                width="100%"
                height="400px"
                data={data}
                options={options} />
        </div>
    )
}

export default MySellListChart
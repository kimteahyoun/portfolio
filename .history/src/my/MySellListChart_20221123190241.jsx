import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Chart from 'react-google-charts';
import UserContext from '../../context/UserContext'


export const options = {
    chart: {
        title: "Company Performance",
        subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
};

const MySellListChart = () => {
    const {loginUser}=useContext(UserContext);
    const [data, setData] = useState('');
    const chartType = useRef('Bar');
    const title = useRef('직업별인원수');

    const options = {
        chart: {
            title: title.current,
        },
        title: title.current
    };

    const callChart = async () => {

        //fetch data from db + put it in state variable
        let result = await axios.get(`/api/tradeinfo/sell/chart?seller=${seller}`);
        let array = chageData(result.data);
        setData(array);
    }

    const chageData = (result) => {
        title.current = '2022 월별 판매 총액';
        chartType.current = 'Line';

        let array = [];
        array.push(['월', '총액']);
        result.forEach(item => {
            array.push([item.month, item.count]);
        });
        return array;
    }



    useEffect(() => {
        callChart();
    })

    return (
        <div>
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
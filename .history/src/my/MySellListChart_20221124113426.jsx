import axios from 'axios';
import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Chart from 'react-google-charts';
import {UserContext} from '../context/UserContext'


export const options = {
    chart: {
        title: "Company Performance",
        subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
};

const MySellListChart = () => {
    const { loginUser } = useContext(UserContext);
    const [data, setData] = useState('');
    const chartType = useRef('Bar');
    const title = useRef('직업별인원수');

    const options = {
        chart: {
            title: title.current,
        },
        title: title.current
    };

    var barChartOption = {
        bars: 'vertical',
        height :260,
        width :'100%',
        legend: { position: "top" },
        isStacked: false,
        tooltip:{textStyle : {fontSize:12}, showColorCode : true},
        animation: { //차트가 뿌려질때 실행될 애니메이션 효과
          startup: true,
          duration: 1000,
          easing: 'linear' },
        annotations: {
            textStyle: {
              fontSize: 15,
              bold: true,
              italic: true,
              color: '#871b47',
              auraColor: '#d799ae',
              opacity: 0.8
            }
       }
 };

    const callChart = async () => {
        //fetch data from db + put it in state variable
        let result = await axios.get(`/api/tradeinfo/sell/chart?seller=${loginUser.unickname}`);
        let array = chageData(result.data);
        setData(array);
    }

    const chageData = (result) => {
        title.current = '2022 월별 판매 총액';
        chartType.current = 'Line';

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
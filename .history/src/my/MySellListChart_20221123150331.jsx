import React, { useRef } from 'react'
import { useEffect } from 'react';
import Chart from 'react-google-charts';
export const options = {
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
  };

const MySellListChart = () => {
    const title = useRef('직업별인원수');
   const options = {
        chart: {
          title: title.current,
        },
        title: title.current
      };

      const callChart = async()=> {
        let array= [];
        let result = null;
        switch(type){
          case "1":
            result = await axios.get('/customers/chart/' + type);
            array = chageData(result.data);
            setData(array);
            break;
          case "2":
            result = await axios.get('/customers/chart/' + type);  
            array = chageData2(result.data);
            setData(array);
            break;
          case "3":
            result = await axios.get('/customers/chart/' + type);
            array = chageData3(result.data); 
            setData(array);
            break; 
          case "4":
            result = await axios.get('/customers/chart1234/job_gender');
            array = chageData4(result.data);
            setData(array);  
            break;
        }
      }

      const chageData = (result) => {
        title.current='2022 월별 회원가입 인원수';
        chartType.current='Line';
    
        let array = [];
        array.push(['월', '인원수']);
        result.forEach(item => {
          array.push([item.month, item.count]);
        });
        return array;
      }
    
  

      useEffect(()=>{
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
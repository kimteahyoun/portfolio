import React, { useRef } from 'react'
import { useEffect } from 'react';
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

      const chageData2 = (result) => {
        title.current='성별인원수';
        chartType.current='PieChart';
    
        let array = [];
        array.push(['성별', '인원수']);
        result.forEach(item => {
          array.push([item.gender, item.count]);
        });
        return array;
      }
    
      const chageData3 = (result) => {
        title.current='2022 월별 회원가입 인원수';
        chartType.current='Line';
    
        let array = [];
        array.push(['월', '인원수']);
        result.forEach(item => {
          array.push([item.month, item.count]);
        });
        return array;
      }
    
      const chageData4 = (result)=> {
        title.current='직업별 성별 인원수';
        chartType.current='Bar';
        return result;
      }

      useEffect(()=>{
        callChart();
      })

  return (
    <div>
        
    </div>
  )
}

export default MySellListChart
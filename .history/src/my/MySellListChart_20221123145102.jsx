import React, { useRef } from 'react'
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

      const callAPI = async()=> {
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

  return (
    <div>
        
    </div>
  )
}

export default MySellListChart
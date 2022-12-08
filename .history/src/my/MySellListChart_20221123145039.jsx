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

  return (
    <div>
        
    </div>
  )
}

export default MySellListChart
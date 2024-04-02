import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [series] = useState([{
    name: 'Kiên đẹp trai',
    data: [90, 100, 80, 60, 100, 109, 100]
  }
]);

  const [options] = useState({
    colors: ['#D56C4E'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 90, 100]
      }
    },
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: [
        "2018-09-19T00:00:00.000Z", 
        "2018-09-19T01:30:00.000Z", 
        "2018-09-19T02:30:00.000Z", 
        "2018-09-19T03:30:00.000Z", 
        "2018-09-19T04:30:00.000Z", 
        "2018-09-19T05:30:00.000Z", 
        "2018-09-19T06:30:00.000Z"]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ApexChart;

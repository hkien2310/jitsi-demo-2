import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = () => {
  const [series] = useState([
    {
      name: "Kiên đẹp trai",
      data: [90, 100, 80, 60, 100, 109, 100],
    },
  ]);

  const [options] = useState({
    colors: ["#D56C4E"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },
    grid: {
      show: false,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: false,

        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom:0, 
        left: 0,
      },
    },
    title: {
      text: "Tổng số cuộc họp",
      align: "left",
      margin: 0,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        // fontFamily:  undefined,
        color: "#263238",
      },
    },
    subtitle: {
      text: "7,800 trong tháng 3",
      align: "left",
      margin: 30,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#000000",
      },
    },
    chart: {
      height: "100%",
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      show: true,
      axisBorder: {
        show: true,
        color: "#999999",
        offsetX: 0,
        offsetY: 0,
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        labels: {
          colors: "red",
          useSeriesColors: false,
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: "#fff",
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0,
        },
      },
      title: {
        text: "Số lượng",
        rotate: 0,
        offsetX: 49,
        offsetY: -190,
        style: {
          color: undefined,
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          cssClass: "apexcharts-yaxis-title",
        },
      },
      // crosshairs: {
      //   show: true,
      //   position: "back",
      //   stroke: {
      //     color: "#b6b6b6",
      //     width: 1,
      //     dashArray: 0,
      //   },
      // },
      // tooltip: {
      //   enabled: true,
      //   offsetX: 0,
      // },
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      title: {
        text: "Ngày",
        offsetX: 400,
        offsetY: 0,
        style: {
          color: "#4D4D4D",
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-title",
        },
        position: "right",
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="area" height={450} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;

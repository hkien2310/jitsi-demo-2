import { Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ButtonSelect from "../Button/ButtonSelect";
import { ApexOptions } from "apexcharts";
import { IResponseStatisticsItem } from "../../interface/dashboard";
import cacheKeys from "../../const/cachedKeys";
import { useGet } from "../../store/useStores";
import { DeviceType } from "../../hooks/useDivices";

interface IProps {
  data: IResponseStatisticsItem[]
  month: number
  onMonthChange: (month: number) => void
}

const listMonth = [
  { id: 1, label: "Tháng Một" },
  { id: 2, label: "Tháng Hai" },
  { id: 3, label: "Tháng Ba" },
  { id: 4, label: "Tháng Tư" },
  { id: 5, label: "Tháng Năm" },
  { id: 6, label: "Tháng Sáu" },
  { id: 7, label: "Tháng Bảy" },
  { id: 8, label: "Tháng Tám" },
  { id: 9, label: "Tháng Chín" },
  { id: 10, label: "Tháng Mười" },
  { id: 11, label: "Tháng Mười Một" },
  { id: 12, label: "Tháng Mười Hai" }
];

const ApexChart = (props: IProps) => {
  const { month, data, onMonthChange } = props
  const category = useMemo(() => (data?.map((e) => e?.date) || []), [data])
  const deviceType = useGet(cacheKeys.DEVICE_TYPE)
  const series = useMemo(() => ([{
    name: "Số cuộc họp",
    data: data?.map((e) => e?.meetingCount)
  }]), [data])



  const [heightChart, setHeightChart] = useState(0)
  // const [series] = useState([
  //   {
  //     name: "Số cuộc họp",
  //     data: [90, 100, 80, 60, 100, 109, 100],
  //   },
  // ]);
  const options: ApexOptions = useMemo(() => {
    return {
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
      // grid: {
      //   show: false,
      //   borderColor: "#90A4AE",
      //   strokeDashArray: 0,
      //   position: "back",
      //   xaxis: {
      //     lines: {
      //       show: true,
      //     },
      //   },
      //   yaxis: {
      //     lines: {
      //       show: true,
      //     },
      //   },
      //   row: {
      //     colors: undefined,
      //     opacity: 0.5,
      //   },
      //   column: {
      //     colors: undefined,
      //     opacity: 0.5,
      //   },
      //   padding: {
      //     top: 0,
      //     right: 0,
      //     bottom: 0,
      //     left: 0,
      //   },
      // },
      // title: {
      //   text: "Tổng số cuộc họp",
      //   align: "left",
      //   margin: 0,
      //   offsetX: 0,
      //   offsetY: 0,
      //   floating: false,
      //   style: {
      //     fontSize: "14px",
      //     fontWeight: "bold",
      //     // fontFamily:  undefined,
      //     color: "#263238",
      //   },
      // },
      // subtitle: {
      //   text: "7,800 trong tháng 3",
      //   align: "left",
      //   margin: 30,
      //   offsetX: 0,
      //   offsetY: 0,
      //   floating: false,
      //   style: {
      //     fontSize: "20px",
      //     fontWeight: "bold",
      //     color: "#000000",
      //   },
      // },
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
        showAlways: true,
        showForNullSeries: true,
        forceNiceScale: true,
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          width: 6,
          offsetX: 0,
          offsetY: 0
        },
        align: 'top',
        axisBorder: {
          show: true,
          color: "#999999",
          offsetX: 0,
          offsetY: 0,
        },
        title: {
          text: "Số lượng",
          // rotate: 0,
          // offsetX: 49,
          // offsetY: -(heightChart / 2 - 70),
          style: {
            color: undefined,
            fontSize: "16px",
            fontFamily: "Roboto, Arial, sans-serif",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-title",
          },
        },
      },
      xaxis: {
        show: true,
        type: "category",
        categories: category,
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        // labels: {
        //   show: true,
        //   // rotate: -45,
        //   rotateAlways: false,
        //   hideOverlappingLabels: true,
        //   showDuplicates: false,
        //   trim: false,
        //   minHeight: undefined,
        //   maxHeight: 120,
        //   style: {
        //     colors: [],
        //     fontSize: '12px',
        //     fontFamily: 'Helvetica, Arial, sans-serif',
        //     fontWeight: 400,
        //     cssClass: 'apexcharts-xaxis-label',
        //   },
        //   offsetX: 0,
        //   offsetY: 0,
        //   format: undefined,
        //   formatter: undefined,
        //   datetimeUTC: true,
        //   datetimeFormatter: {
        //     year: 'yyyy',
        //     month: "MMM 'yy",
        //     day: 'dd MMM',
        //     hour: 'HH:mm',
        //   },
        // },
        title: {
          text: "Ngày",
          // offsetX: 400,
          // offsetY: 20,
          style: {
            color: "#4D4D4D",
            fontSize: "16px",
            textAlign: 'right',
            fontFamily: "Roboto, Arial, sans-serif",
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
    }
  }, [category])

  useEffect(() => {
    const chartContainer = document.getElementById('container-chart')
    const headerChart = document.getElementById('header-chard')
    const height = chartContainer?.offsetHeight
    const headerChartHeight = headerChart?.offsetHeight

    setHeightChart((height ?? 0) - (headerChartHeight ?? 0))
  }, [])


  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} id={'header-chard'}>
        <Box sx={{ textAlign: 'left' }}>
          <Box sx={{ opacity: 0.6, fontSize: '20px', fontWeight: 500 }}>Tổng số cuộc họp</Box>
          <Box>
            <span>
              <span style={{ fontSize: '40px', fontWeight: 600 }}>
                {series?.[0]?.data?.reduce((total, current) => total + current, 0).toLocaleString()}
              </span>
              <span style={{ fontSize: '20px', fontWeight: 600 }}>
                {` trong tháng ${month}`}
              </span>
            </span>
          </Box>
        </Box>
        <Box>
          <ButtonSelect options={listMonth} value={month} onChange={(value) => onMonthChange(value)} defaultText="" />
        </Box>
      </Box>
      {
        deviceType !== DeviceType.MOBILE &&
        <Box id="chart">
          <ReactApexChart options={options} series={series} type="area" height={(heightChart - 64 * 1.5)} />
        </Box>
      }
      <Box id="html-dist"></Box>
    </Box>
  );
};

export default ApexChart;

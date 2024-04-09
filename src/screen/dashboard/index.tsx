import { Box, Grid } from "@mui/material";
import ItemDashboard from "./component/ItemDashboard";
import ItemFile from "./component/ItemFile";
import ApexChart from "../../component/Chart";
import NavigationBar from "../../component/NavigationBar";
import useGetListDashboardCount from "../../hooks/useGetDashboardCount";
import { useGet, useSave } from "../../store/useStores";
import { useCallback, useEffect, useMemo, useState } from "react";
import useGetListFilesDashboard from "../../hooks/useGetListFilesDashboard";
import useFiltersHandler from "../../hooks/useFilters";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetListDashboardDataChart from "../../hooks/useGetDashboardDataChart";
import { downloadFile, getStartEndOfMonth } from "../../helper/function";
import { ROOT_URL_ASSET } from "../../const/api";
import useDeviceType, { DeviceType } from "../../hooks/useDivices";
import cacheKeys from "../../const/cachedKeys";

// const dataMock = [
//   {
//     id: 1,
//     fileName: "Báo cáo tài chính tháng 2",
//     fileType: "jpg",
//   },
//   {
//     id: 2,
//     fileName: "Báo cáo tài chính tháng 3",
//     fileType: "doc",
//   },
//   {
//     id: 3,
//     fileName: "Khảo sát ngành thực phẩm",
//     fileType: "pdf",
//   },
//   {
//     id: 4,
//     fileName: "Báo cáo kết quả kinh doanh",
//     fileType: "xlsx",
//   },
// ];
const DashboardScreen = () => {
  const currentDate = new Date();

  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const { data: dataCount, isLoading: isLoadingCount } = useGetListDashboardCount()
  const { data: dataChart, isLoading: isLoadingChart, fetch: fetchChart } = useGetListDashboardDataChart()
  const [heightFile, setHeightFile] = useState(800)
  const deviceType = useGet(cacheKeys.DEVICE_TYPE)

  const { filters, handleChangePage } = useFiltersHandler({
    page: 1,
    perPage: 20,
  })
  const { data: dataFile, isLoading: isLoadingFile, hasMore: hasMoreFile } = useGetListFilesDashboard(filters, true)
  const save = useSave()

  const fetchFileMore = () => {
    handleChangePage(filters.page + 1)
  }

  useEffect(() => {
    const containerDiv = document.getElementById('container-file')
    const containerFileHeaderElement = document.getElementById('header-file')
    const containerFileHeight = containerDiv?.offsetHeight || 0
    const containerFileHeightHeader = containerFileHeaderElement?.offsetHeight || 0
    setHeightFile(containerFileHeight - containerFileHeightHeader - 200)
  }, [])

  useEffect(() => {
    save(isLoadingCount || isLoadingFile || isLoadingChart)
  }, [isLoadingCount, isLoadingFile, isLoadingChart, save])

  useEffect(() => {
    fetchChart({
      fromDate: getStartEndOfMonth(month).startDate.toISOString(),
      toDate: getStartEndOfMonth(month).endDate.toISOString(),
    })
  }, [fetchChart, month])

  const isMobile = useMemo(() => {
    return deviceType === DeviceType.MOBILE
  }, [deviceType])
  const renderChart = useCallback(() => {
    return <Box px={isMobile ? 2 : 5} py={isMobile ? 2 : 4}>
      <ApexChart data={dataChart} month={month} onMonthChange={(value) => setMonth(value)} />
    </Box>
  }, [dataChart, isMobile, month])


  return (
    <NavigationBar>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box id={'header-dashboard'} sx={{ textAlign: "left", color: "#000000", fontSize: "24px", fontWeight: 600 }}>Dashboard</Box>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12} pb={isMobile ? 2 : 3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? undefined : 'calc(100vh - 150px)' }}>
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <Box>
                    <ItemDashboard numeral={dataCount?.IN_MEETING || 0} isInprogress />
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box>
                    <ItemDashboard numeral={dataCount?.FINISHED || 0} />
                  </Box>
                </Grid>

              </Grid>
              {/* id={'container-chart'} */}
              <Box pt={2} sx={{ height: '100%' }} id={'container-chart'} >
                <Grid item xs={12} sx={{ boxShadow: '4px 0px 20px 0px rgba(0,0,0,0.08)', backgroundColor: 'white', }} >
                  {renderChart()}
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item md={4} xs={12} sx={{ display: "flex", height: isMobile ? undefined : '100%' }} pb={isMobile ? 2 : 3}>
            <Box id={'container-file'} sx={{ height: '100%', backgroundColor: "white", boxShadow: "4px 0px 20px 0px rgba(0,0,0,0.08)", width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box id={'header-file'} sx={{ textAlign: "left", pb: "25px", boxShadow: "0px 4px 20px 0px #84848414", pl: "40px", pr: "40px", pt: "36px", fontWeight: 500 }}>
                Các file được chia sẻ gần đây
              </Box>
              <Box sx={{
                height: heightFile,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
                py={2}
                id={"scrollableDiv"}
              >
                <InfiniteScroll
                  dataLength={(dataFile?.data?.length || 0) * 2}
                  next={fetchFileMore}
                  hasMore={hasMoreFile}
                  loader={<h4>Đang tải...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                  <Grid container spacing={2} px={2}>
                    {dataFile?.data?.map((elm, idx) => {
                      return <Grid item xs={12} key={idx} >
                        <ItemFile fileName={elm?.fileName} onClick={() => downloadFile(`${ROOT_URL_ASSET}${elm?.filePath}`, elm?.fileName)} />
                      </Grid>
                    })}
                  </Grid>
                </InfiniteScroll>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </NavigationBar>
  );
};
export default DashboardScreen;

import { Box, Grid } from "@mui/material";
import ItemDashboard from "./component/ItemDashboard";
import ItemFile from "./component/ItemFile";
import ApexChart from "../../component/Chart";
import NavigationBar from "../../component/NavigationBar";
import useGetListDashboardCount from "../../hooks/useGetDashboardCount";
import { useSave } from "../../store/useStores";
import { useEffect, useState } from "react";
import useGetListFilesDashboard from "../../hooks/useGetListFilesDashboard";
import useFiltersHandler from "../../hooks/useFilters";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetListDashboardDataChart from "../../hooks/useGetDashboardDataChart";
import { downloadFile, getStartEndOfMonth } from "../../helper/function";
import { ROOT_URL_ASSET } from "../../const/api";

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
    setHeightFile(containerFileHeight - containerFileHeightHeader)
  }, [])

  useEffect(() => {
    save(isLoadingCount || isLoadingFile || isLoadingChart)
  }, [isLoadingCount, isLoadingFile, isLoadingChart, save])

  useEffect(() => {
    fetchChart({
      fromDate: getStartEndOfMonth(month).startDate.toISOString(),
      toDate: getStartEndOfMonth(month).endDate.toISOString(),
    })
  }, [fetchChart, month] )
  console.log(heightFile, 'heightFileheightFile')
  return (
    <NavigationBar>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ textAlign: "left", ml: 3, color: "#000000", fontSize: "24px", fontWeight: 600 }}>Dashboard</Box>
        <Grid container spacing={2} sx={{ flex: 1 }}>
          <Grid item xs={8} pb={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <ItemDashboard numeral={dataCount?.IN_MEETING || 0} isInprogress />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <ItemDashboard numeral={dataCount?.FINISHED || 0} />
                  </Box>
                </Grid>

              </Grid>
              {/* id={'container-chart'} */}
              <Box pt={2} sx={{ height: '100%' }} id={'container-chart'} >
                <Grid item xs={12} sx={{ boxShadow: '4px 0px 20px 0px rgba(0,0,0,0.08)', backgroundColor: 'white', }} px={5} py={4}>
                  <ApexChart data={dataChart} month={month} onMonthChange={(value) => setMonth(value)}/>
                </Grid>
              </Box>
            </Box>

          </Grid>

          <Grid item xs={4} sx={{ display: "flex", height: '100%' }} pb={3}>
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
                pt={2}
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
                        <ItemFile fileName={elm?.fileName} onClick={() => downloadFile(`${ROOT_URL_ASSET}${elm?.filePath}`, elm?.fileName)}/>
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

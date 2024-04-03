import { Box, Grid } from "@mui/material";
import ItemDashboard from "./component/ItemDashboard";
import ItemFile from "./component/ItemFile";
import ApexChart from "../../component/Chart";

const dataMock = [
  {
    id: 1,
    fileName: "Báo cáo tài chính tháng 2",
    fileType: "jpg",
  },
  {
    id: 2,
    fileName: "Báo cáo tài chính tháng 3",
    fileType: "doc",
  },
  {
    id: 3,
    fileName: "Khảo sát ngành thực phẩm",
    fileType: "pdf",
  },
  {
    id: 4,
    fileName: "Báo cáo kết quả kinh doanh",
    fileType: "xlsx",
  },
];
const DashboardScreen = () => {
  return (
    <Box>
      <Box sx={{ textAlign: "left", ml: 3, color: "#000000", fontSize: "24px", fontWeight: 600 }}>Dashboard</Box>
      <Grid container spacing={{ xs: 2 }} p={3}>
        <Grid item xs={8} spacing={{ xs: 2 }} rowGap={5}>
          <Grid container xs={12} spacing={{ xs: 2 }}>
            <Grid item xs={6}>
              <ItemDashboard numeral={85} isInprogress />
            </Grid>
            <Grid item xs={6}>
              <ItemDashboard numeral={105} />
            </Grid>
          </Grid>
          <Grid container xs={12} sx={{ mt: 2 }} >
            <Grid item xs={12} sx={{ boxShadow: '4px 0px 20px 0px rgba(0,0,0,0.08)', backgroundColor: 'white', height: '497px' }} >
              {/* <Box sx={{ flex: 1, display: "flex", height: 500 }}> */}
                <ApexChart />
              {/* </Box> */}
            </Grid>
          </Grid>
        </Grid>
       
        <Grid id="helo" item xs={4} sx={{ display: "flex" }}>
          <Box sx={{ backgroundColor: "white", boxShadow: "4px 0px 20px 0px rgba(0,0,0,0.08)" }}>
            <Box sx={{ textAlign: "left", pb: "25px", boxShadow: "0px 4px 20px 0px #84848414", pl: "40px", pr: "40px", pt: "36px" }}>
              Các file được chia sẻ gần đây
            </Box>
            <Box sx={{ mt: "25px", display: "grid", gap: 1, pb: "25px", pr: "40px", pl: "40px" }}>
              {dataMock.map((elm, idx) => {
                return <ItemFile fileName={elm?.fileName} fileType={elm?.fileType} key={idx} />;
              })}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DashboardScreen;

import { Box } from "@mui/material";
import { ImageSource } from "../../../assets/Image";
import { renderLogo } from "../../../component/UploadFile/Drag";
interface IProps {
  onClick?: () => void;
  fileName: string;
  // fileType: string;
}
const ItemFile = (props: IProps) => {
  const { onClick, fileName } = props;
  const fileType = fileName?.split(".")?.pop()
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        backgroundColor: "rgba(210, 215, 221, 0.2)",
        borderRadius: "8px",
        padding: "14px 18px",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={renderLogo(fileType || "")} alt={"logo"} style={{ height: 25.11, width: 27 }} />
        <Box sx={{ ml: "12px", color: "#4D4D4D", fontSize: "14px", fontWeight: 500, textOverflow: "ellipsis" }}>{fileName}</Box>
      </Box>
      <img src={ImageSource.importIcon} style={{ height: 24, width: 24 }} />
    </Box>
  );
};
export default ItemFile;

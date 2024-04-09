import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ImageSource } from "../../../assets/Image";
import TooltipButton from "../../../component/Tooltip";

interface IProps {
  onClickDetail: (row: any) => void;
  onClickEdit: (row: any) => void;
  onClickDelete: (row: any) => void;
  isMobile: boolean
}

const columnsRole = (props: IProps) => {
  const { onClickDetail, onClickEdit, onClickDelete, isMobile } = props;
  // const userInfo = AuthServices.getUserLocalStorage();

  const columns: GridColDef[] = [
    {
      field: "stt",
      headerName: "STT",
      flex: 1,
      minWidth: isMobile ? 25 : undefined,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Tên nhóm",
      flex: 1,
      minWidth: isMobile ? 200 : undefined,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "code",
      headerName: "Mã nhóm",
      flex: 1,
      minWidth: isMobile ? 200 : undefined,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Hành động",
      sortable: false,
      minWidth: isMobile ? 250 : undefined,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <TooltipButton title="Chi tiết" onClick={() => onClickDetail(row)}>
              {/* <InfoOutlined color="info" /> */}
              <img src={ImageSource.eye} style={{ height: 24, width: 24 }} alt={""} />
            </TooltipButton>
            <TooltipButton
              title={"Chỉnh sửa"}
              onClick={() => {
                onClickEdit(row);
              }}
            >
              {/* <DescriptionOutlinedIcon color="inherit" /> */}
              <img src={ImageSource.edit} style={{ height: 24, width: 24 }} alt={""} />
            </TooltipButton>
            <TooltipButton title="Xoá" onClick={() => onClickDelete(row)}>
              {/* <DeleteOutlineOutlinedIcon color="error" /> */}
              <img src={ImageSource.bag} alt={""} />
            </TooltipButton>
          </Box>
        );
      },
    },
  ];

  return columns;
};

export default columnsRole;

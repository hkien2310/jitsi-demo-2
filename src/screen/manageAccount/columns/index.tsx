import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ImageSource } from "../../../assets/Image";
import TooltipButton from "../../../component/Tooltip";
import AuthServices from "../../../services/Auth.services";

interface IProps {
  onClickDetail: (row: any) => void;
  onClickNote: (row: any) => void;
  onClickDelete: (row: any) => void;
  onComplete: (row: any) => void;
  onJoin: (row: any) => void;
}

const columnsAcc = (props: IProps) => {
  const { onClickDetail, onClickNote, onClickDelete, onComplete, onJoin } = props;
  // const userInfo = AuthServices.getUserLocalStorage();

  const columns: GridColDef[] = [
    {
      field: "stt",
      headerName: "STT",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "username",
      headerName: "Tài khoản",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "fullname",
      headerName: "Họ và tên",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Hành động",
      sortable: false,
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
                onClickNote(row);
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

export default columnsAcc;

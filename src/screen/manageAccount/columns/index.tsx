import { Box } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ImageSource } from "../../../assets/Image";
import TooltipButton from "../../../component/Tooltip";
import AuthServices from "../../../services/Auth.services";

interface IProps {
  onClickDetail: (row: any) => void;
  onClickEdit: (row: any) => void;
  onClickDelete: (row: any) => void;
  isMobile: boolean
}

const columnsAcc = (props: IProps) => {
  const { onClickDetail, onClickEdit, onClickDelete, isMobile } = props;

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
      field: "username",
      headerName: "Tài khoản",
      flex: 1,
      minWidth: isMobile ? 200 : undefined,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "fullname",
      headerName: "Họ và tên",
      minWidth: isMobile ? 200 : undefined,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: isMobile ? 200 : undefined,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      sortable: false,
    },
    {
      field: "action",
      headerName: "Hành động",
      minWidth: isMobile ? 250 : undefined,
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

export default columnsAcc;

import { InfoOutlined, UploadFile } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box, Button } from "@mui/material";
import { green, yellow } from "@mui/material/colors";
import { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import TooltipButton from "../../../component/Tooltip";
import AuthServices from "../../../services/Auth.services";
import { typeMeetingOptions } from "../AddMetting";
import { colors } from "../../../const/colors";
import { IconsSource } from "../../../const/icons";
import { ImageSource } from "../../../assets/Image";


interface IProps {
    onClickDetail: (row: any) => void
    onClickNote: (row: any) => void
    onClickDelete: (row: any) => void
    onComplete: (row: any) => void
    onJoin: (row: any) => void
}

export enum EnumMeetingStatus {
    WAITING = 'WAITING',
    IN_MEETING = 'IN_MEETING',
    FINISHED = 'FINISHED',
}

export const meetingStatus: { [key: string]: string } = {
    WAITING: "Đang chờ",
    IN_MEETING: "Đang diễn ra",
    FINISHED: "Hoàn thành",
};
const meetingColorStatus: { [key: string]: string } = {
    WAITING: colors.text.wait,
    IN_MEETING: "#007bff",
    FINISHED: colors.text.success,
};

const meetingColorStatusBg: { [key: string]: string } = {
    WAITING: colors.background.wait,
    IN_MEETING: "#007bff",
    FINISHED: colors.background.success,
};

const columnsMeet = (props: IProps) => {
    const { onClickDetail, onClickNote, onClickDelete, onComplete, onJoin } = props
    const userInfo = AuthServices.getUserLocalStorage();


    const columns: GridColDef[] = [
        {
            field: "stt",
            headerName: "STT",
            // flex: 1,
            width: 25,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            sortable: false,
        },
        {
            field: "title",
            headerName: "Tên cuộc họp",
            flex: 1,
            // minWidth: 120,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            sortable: false,
        },
        {
            field: "description",
            headerName: "Mô tả",
            flex: 1,
            // minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            sortable: false,
        },
        {
            field: "decentralize",
            headerName: "Thành viên",
            // minWidth: 250,
            editable: false,
            sortable: false,
            // renderCell: ({ row }) => {
            //     const members = row?.members.map((elm: any) => elm?.user.fullname);
            //     const stringMember = members.join(", ");
            //     return <Box p={1}>{stringMember}</Box>;
            // },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "type",
            headerName: "Loại phiên họp",
            flex: 1,
            // minWidth: 200,
            editable: false,
            sortable: false,
            renderCell: ({ row }) => {
                const type = typeMeetingOptions.find((e) => row.type === e.value)?.label;
                return <Box p={1}>{type}</Box>;
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "startTime",
            headerName: "Thời gian từ",
            flex: 1,
            // minWidth: 200,
            editable: false,
            sortable: false,
            renderCell: ({ row }) => {
                const from = dayjs(row.startTime).format("DD.MM.YYYY - HH:mm"); // '25/01/2019'
                return <Box p={1}>{from}</Box>;
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "endTime",
            headerName: "Thời gian hết hạn",
            flex: 1,
            // minWidth: 200,
            editable: false,
            sortable: false,
            renderCell: ({ row }) => {
                const endTime = dayjs(row?.endTime).format("DD.MM.YYYY - HH:mm"); // '25/01/2019'
                return <Box p={1}>{endTime}</Box>;
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "location",
            headerName: "Địa điểm",
            flex: 1,
            // minWidth: 125,
            editable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "status",
            headerName: "Trạng thái",
            // type: "number",
            flex: 1,
            // minWidth: 125,
            editable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ row }) => {
                return (
                    <Box
                        // variant="outlined"
                        py={1}
                        sx={{
                            width: 200,
                            borderRadius: '8px',
                            // border: `1px solid ${meetingColorStatus[`${row.status}`]}`,
                            color: meetingColorStatus[`${row.status}`],
                            textTransform: "unset",
                            backgroundColor: meetingColorStatusBg[`${row.status}`],
                            fontWeight: 500
                        }}
                    >
                        {meetingStatus[`${row.status}`]}
                    </Box>
                    // <Box p={1} sx={{ color: meetingColorStatus[`${row.status}`] }}>
                    //   {meetingStatus[`${row.status}`]}
                    // </Box>
                );
            },
        },
        {
            field: "action",
            headerName: "Hành động",
            sortable: false,
            flex: 1,
            minWidth: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: ({ row }) => {
                const isDisabled = row.status === "FINISHED";
                if (isDisabled)
                    return (
                        <>
                            <TooltipButton title="Chi tiết" onClick={() => onClickDetail(row)}>
                                {/* <InfoOutlined color="info" /> */}
                                <img src={ImageSource.warning} alt={''} />
                            </TooltipButton>
                            <TooltipButton
                                title={"Ghi chú cuộc họp"}
                                onClick={() => { onClickNote(row) }}
                            >
                                {/* <DescriptionOutlinedIcon color="inherit" /> */}
                                <img src={ImageSource.note} alt={''} />
                            </TooltipButton>
                            <TooltipButton title="Xoá" onClick={() => onClickDelete(row)}>
                                {/* <DeleteOutlineOutlinedIcon color="error" /> */}
                                <img src={ImageSource.bag} alt={''} />
                            </TooltipButton>
                        </>
                    );
                return (
                    <Box style={{ display: "flex", flexDirection: "row" }}>
                        <TooltipButton title="Chi tiết" onClick={() => onClickDetail(row)}>
                            <img src={ImageSource.warning} alt={''} />
                            {/* <InfoOutlined color="info" /> */}
                        </TooltipButton>

                        <TooltipButton
                            title="Tham gia"
                            onClick={() => {
                                onJoin(row)
                            }}
                        >
                            {/* <LoginOutlinedIcon color="primary" /> */}
                            <img src={ImageSource.login} alt={''} />
                        </TooltipButton>
                        {`${row?.creatorId}` === `${userInfo.id}` ? (
                            <TooltipButton title="Hoàn thành" onClick={() => onComplete(row)}>
                                <TaskAltOutlinedIcon color="success" />
                            </TooltipButton>
                        ) : null}
                        <TooltipButton title="Tải tệp">
                            <img src={ImageSource.documentUpload} alt={''} />
                            {/* <UploadFile color="action" /> */}
                        </TooltipButton>
                        <TooltipButton title="Xoá" onClick={() => onClickDelete(row)}>
                            {/* <DeleteOutlineOutlinedIcon color="error" /> */}
                            <img src={ImageSource.bag} alt={''} />
                        </TooltipButton>
                    </Box>
                );
            },
        },
    ];

    return columns
}

export default columnsMeet
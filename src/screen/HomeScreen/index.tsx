import { InfoOutlined, UploadFile } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { blue } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FastField, Formik } from "formik";
import queryString from "query-string";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonCommon from "../../component/Button";
import NavigationBar from "../../component/NavigationBar";
import TextField from "../../component/TextField";
import TooltipButton from "../../component/Tooltip";
import ButtonDialog from "../../component/dialog/ButtonDialog";
import cacheKeys from "../../const/cachedKeys";
import { RoleMeeting } from "../../const/enum";
import { showError } from "../../helper/toast";
import useFiltersHandler from "../../hooks/useFilters";
import useGetListMeeting from "../../hooks/useGetListMeeting";
import useGetListMeetingNote from "../../hooks/useGetListMeetingNote";
import AuthServices from "../../services/Auth.services";
import MeetingServices from "../../services/Meeting.services";
import { useGet, useSave } from "../../store/useStores";
import AddMeeting, { typeMeetingOptions } from "./AddMetting";
import DialogCommon from "../../component/dialog";
import DialogConfirm from "../../component/dialog/DialogConfirm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { red, green, yellow } from "@mui/material/colors";
import dayjs from "dayjs";
import { renderSTT } from "../../helper/function";
// import typeMeetingOptions from "../../../AddMeeting"

const HomeScreen = () => {
  const navigate = useNavigate();
  const deleteRef = useRef();
  const completeRef = useRef();

  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [dataRow, setDataRow] = useState();
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const refFormik = useRef<any>(null);
  const userInfo = AuthServices.getUserLocalStorage();

  const { filters, handleChangePage } = useFiltersHandler({ page: 0, perPage: 10 });
  const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0 });
  const { data: dataListMeetingNote, refetch: refetchMeetingNote } = useGetListMeetingNote(filtersMeetingNote, { isTrigger: false });
  const { data, refetch } = useGetListMeeting(filters);

  // const useGetListMeetingNote
  const paginationModel = React.useMemo(() => {
    return {
      pageSize: filters?.perPage,
      page: filters?.page,
    };
  }, [filters]);

  const save = useSave();
  const rows = useGet(cacheKeys.DEMO_LIST);

  const setRows = (value: any[]) => {
    save(cacheKeys.DEMO_LIST, value);
  };
  const handleConfirmDelete = async () => {
    try {
      await MeetingServices.deleteMeeting(deleteRef.current?.id);
      setConfirmDelete(false);
      refetch();
    } catch (error: any) {
      showError(error);
    }
  };
  const handleDelete = async (row: any) => {
    deleteRef.current = row;
    // const newValue = rows?.filter((item: any) => item.id !== row.id);
    // setRows(newValue);
    setConfirmDelete(true);
  };
  const handleConfirmComplete = async () => {
    const body = {
      status: "FINISHED",
    };
    try {
      const response = await MeetingServices.updateMeeting(completeRef.current?.id, body);
      if (response?.data) {
        setConfirmComplete(false);
        refetch();
      }
    } catch (error: any) {
      showError(error);
    }
  };
  const handleComplete = async (row: any) => {
    completeRef.current = row;
    setConfirmComplete(true);
  };

  const handleClickOpenDialogViewNote = () => {
    setNoteViewOpen(true);
  };

  const handleCloseDialogViewNote = () => {
    setNoteViewOpen(false);
  };

  const openDetail = (row: any) => {
    setOpen(row);
    setDataRow(row);
  };

  const columns: GridColDef[] = [
    {
      field: "stt",
      headerName: "STT",
      width: 90,
      // renderCell: (row) => {
      //   return <>{row.id}</>;
      // },
    },
    {
      field: "title",
      headerName: "Tên cuộc họp",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: "decentralize",
      headerName: "Thành viên",
      flex: 1,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        const members = row?.members.map((elm: any) => elm?.user.fullname);
        const stringMember = members.join(", ");
        return <Box p={1}>{stringMember}</Box>;
      },
    },
    {
      field: "type",
      headerName: "Loại phiên họp",
      flex: 1,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        const type = typeMeetingOptions.find((e) => row.type === e.value)?.label;
        return <Box p={1}>{type}</Box>;
      },
    },
    {
      field: "startTime",
      headerName: "Thời gian từ",
      width: 200,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        const from = dayjs(row.startTime).format("LLLL"); // '25/01/2019'
        return <Box p={1}>{from}</Box>;
      },
    },
    {
      field: "endTime",
      headerName: "Thời gian hết hạn",
      width: 200,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        const endTime = dayjs(row?.endTime).format("LLLL"); // '25/01/2019'
        return <Box p={1}>{endTime}</Box>;
      },
    },
    {
      field: "location",
      headerName: "Địa điểm",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      // type: "number",
      width: 150,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        const meetingStatus: { [key: string]: string } = {
          WAITING: "Đang chờ",
          IN_MEETING: "Đang diễn ra",
          FINISHED: "Hoàn thành",
        };
        const meetingColorStatus: { [key: string]: string } = {
          WAITING: yellow[800],
          IN_MEETING: "#007bff",
          FINISHED: green[800],
        };
        return (
          <Button
            variant="outlined"
            sx={{
              width: 200,
              borderRadius: 50,
              border: `1px solid ${meetingColorStatus[`${row.status}`]}`,
              color: meetingColorStatus[`${row.status}`],
              textTransform: "unset",
            }}
          >
            {meetingStatus[`${row.status}`]}
          </Button>
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
      width: 300,
      renderCell: ({ row }) => {
        const isDisabled = row.status === "FINISHED";
        if (isDisabled)
          return (
            <>
              <TooltipButton
                title={"Ghi chú cuộc họp"}
                onClick={() => {
                  handleClickOpenDialogViewNote();
                  refetchMeetingNote({ ...filtersMeetingNote, meetingId: row?.id });
                }}
              >
                <DescriptionOutlinedIcon color="inherit" />
              </TooltipButton>
              <TooltipButton title="Xoá" onClick={() => handleDelete(row)}>
                <DeleteOutlineOutlinedIcon color="error" />
              </TooltipButton>
            </>
          );
        return (
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <TooltipButton title="Chi tiết" onClick={() => openDetail(row)}>
              <InfoOutlined color="info" />
            </TooltipButton>
            <TooltipButton title="Xoá" onClick={() => handleDelete(row)}>
              <DeleteOutlineOutlinedIcon color="error" />
            </TooltipButton>
            <TooltipButton
              title="Tham gia"
              onClick={() => {
                const body = {
                  room: row?.meetingCode,
                  roomName: row?.title,
                  meetingId: row?.id,
                  idRoleSecretary: row?.members?.find((e: any) => e?.memberType === RoleMeeting.SECRETARY)?.user?.id || null,
                };
                navigate(`/call?${queryString.stringify(body)}`);
              }}
            >
              <LoginOutlinedIcon color="primary" />
            </TooltipButton>
            {`${row?.creatorId}` === `${userInfo.id}` ? (
              <TooltipButton title="Hoàn thành" onClick={() => handleComplete(row)}>
                <TaskAltOutlinedIcon color="success" />
              </TooltipButton>
            ) : null}
            <TooltipButton title="Tải tệp">
              <UploadFile color="action" />
            </TooltipButton>
          </Box>
        );
      },
    },
  ];

  const dataRows = React.useMemo(() => {
    return data?.data?.map((e, index) => ({ ...e, stt: renderSTT(index, filters.page, filters.perPage) })) || [];
  }, [data?.data, filters.page, filters.perPage]);

  const onAdd = async (value: any) => {
    const newValue = {
      id: rows?.length + 1,
      ...value,
    };
    const result = [...rows, newValue];
    setRows(result);
    setOpen(false);
  };

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const renderListNote = () => {
    return (
      <Box>
        <Box sx={{ fontSize: "20px", fontWeight: "bold" }}>Ghi chú của cuộc họp</Box>
        <Box>
          {dataListMeetingNote?.data && dataListMeetingNote?.data?.length > 0 ? (
            dataListMeetingNote?.data?.map((e, index) => {
              return <Box key={e?.id}>{`${index + 1}. ${e?.content}`}</Box>;
            })
          ) : (
            <Box>Cuộc họp này chưa có ghi chú</Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <NavigationBar>
      <Formik
        innerRef={refFormik}
        initialValues={{
          search: "",
        }}
        onSubmit={(values) => {
          if (values.search) {
            refetch({ ...filters, textSearch: refFormik?.current?.values?.search });
          }
        }}
      >
        {({ handleSubmit }) => {
          return (
            <>
              <Box sx={{ display: "flex" }}>
                {noteViewOpen && (
                  <Dialog
                    open={noteViewOpen}
                    TransitionComponent={Transition}
                    keepMounted={false}
                    onClose={handleCloseDialogViewNote}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">{renderListNote()}</DialogContentText>
                    </DialogContent>
                  </Dialog>
                )}
                <Box sx={{ justifyContent: "space-between", flex: 1, display: "flex" }} mb={2}>
                  <Box>
                    <FastField
                      style={{ width: 400 }}
                      size="small"
                      id={"search"}
                      component={TextField}
                      name={"search"}
                      required
                      placeholder="Nhập tên cuộc họp"
                      fullWidth
                    />
                    <ButtonCommon
                      sx={{ padding: 1, minWidth: "auto", marginLeft: 1, borderRadius: 1 }}
                      color="info"
                      variant="contained"
                      onClick={() => handleSubmit()}
                    >
                      <SearchOutlinedIcon /> Tìm kiếm
                    </ButtonCommon>
                  </Box>
                  <ButtonCommon
                    sx={{ padding: 1, minWidth: "auto", marginLeft: 1, borderRadius: 1 }}
                    color="error"
                    variant="contained"
                    onClick={() => setOpen(true)}
                  >
                    <AddIcon /> Thêm mới cuộc họp
                  </ButtonCommon>
                </Box>
              </Box>
            </>
          );
        }}
      </Formik>
      <DataGrid
        rows={dataRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: paginationModel,
          },
        }}
        paginationMode="server"
        sortingMode="server"
        rowCount={data?.total || 0}
        onPaginationModelChange={(model) => handleChangePage(model?.page)}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        // hideFooterPagination={true}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            background: blue["A100"],
            color: "white",
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "700",
            },
          },
        }}
      />
      <DialogCommon
        title={dataRow ? "Chi tiết" : "Thêm mới"}
        open={open}
        handleClose={() => {
          setOpen(false);
          setDataRow(undefined);
        }}
        content={
          <Box sx={{ width: "75vw" }}>
            <AddMeeting refetchList={refetch} onAdd={onAdd} data={dataRow} onClose={() => setOpen(false)} />
          </Box>
        }
      />
      <DialogConfirm
        handleClose={() => {
          setConfirmDelete(false);
        }}
        title="Bạn chắc chắn muốn xoá phiên họp này?"
        open={confirmDelete}
        icon={<DeleteForeverIcon color="error" />}
        children={
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1 }} width="100%">
            <Button variant="outlined" onClick={() => setConfirmDelete(false)} sx={{ fontWeight: "550" }} color="error">
              Huỷ bỏ
            </Button>
            <Button variant="contained" onClick={handleConfirmDelete} sx={{ fontWeight: "550", ml: 1 }} color="error">
              Đồng ý
            </Button>
          </Box>
        }
        bgcolor={red[100]}
      />
      <DialogConfirm
        handleClose={() => {
          setConfirmComplete(false);
        }}
        title="Bạn chắc chắn muốn hoàn thành?"
        open={confirmComplete}
        icon={<TaskAltOutlinedIcon color="success" />}
        children={
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1 }} width="100%">
            <Button variant="outlined" onClick={() => setConfirmComplete(false)} sx={{ fontWeight: "550" }} color="success">
              Huỷ bỏ
            </Button>
            <Button variant="contained" onClick={handleConfirmComplete} sx={{ fontWeight: "550", ml: 1 }} color="success">
              Đồng ý
            </Button>
          </Box>
        }
        bgcolor={green[100]}
      />
    </NavigationBar>
  );
};

export default HomeScreen;

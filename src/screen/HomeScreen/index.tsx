import { InfoOutlined, UploadFile } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { blue } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FastField, Formik } from "formik";
import queryString from "query-string";
import React, { useState } from "react";
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
import AddMeeting from "./AddMetting";

const HomeScreen = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [dataRow, setDataRow] = useState();
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const userInfo = AuthServices.getUserLocalStorage();

  const { filters, handleChangePage } = useFiltersHandler({ page: 0 });

  const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0 });
  const { data: dataListMeetingNote, refetch: refetchMeetingNote } = useGetListMeetingNote(filtersMeetingNote, { isTrigger: false });

  // const useGetListMeetingNote
  const paginationModel = React.useMemo(() => {
    return {
      // pageSize: filters?.,
      page: filters?.page,
    };
  }, [filters]);

  const { data, refetch } = useGetListMeeting(filters);

  const save = useSave();
  const rows = useGet(cacheKeys.DEMO_LIST);

  const setRows = (value: any[]) => {
    save(cacheKeys.DEMO_LIST, value);
  };
  const handleDelete = async (row: any) => {
    // const newValue = rows?.filter((item: any) => item.id !== row.id);
    // setRows(newValue);
    try {
      await MeetingServices.deleteMeeting(row.id);
      refetch();
    } catch (error: any) {
      showError(error);
    }
  };
  const handleComplete = async (row: any) => {
    const body = {
      status: "FINISHED",
    };
    try {
      const response = await MeetingServices.updateMeeting(row.id, body);
      if (response?.data) {
        refetch();
      }
    } catch (error: any) {
      showError(error);
    }
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
      field: "id",
      headerName: "STT",
      width: 90,
      renderCell: (row) => {
        return <>{row.id}</>;
      },
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
      // renderCell: ({ row }) => {
      //   return (
      //     <Box style={{ display: "flex", flexDirection: "row", alignItems: "center",  }}>
      //       <Box
      //         p={1}
      //       // sx={{  borderRadius: "10px", width: 100 }}
      //       // onClick={() => {
      //       //   const body = {
      //       //     room: row?.id,
      //       //     roomName: row?.name,
      //       //   };
      //       //   navigate(`/call?${queryString.stringify(body)}`);
      //       // }}
      //       >
      //         {row.description}
      //       </Box>
      //     </Box>
      //   );
      // },
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
    // {
    //   field: 'time',
    //   headerName: 'Thời gian bắt đầu',
    //   width: 200,
    //   editable: false,
    //   sortable: false,
    // },
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
          WAITING: "#ffc107",
          IN_MEETING: "#007bff",
          FINISHED: "#28a745",
        };
        return (
          <Box p={1} sx={{ color: meetingColorStatus[`${row.status}`] }}>
            {meetingStatus[`${row.status}`]}
          </Box>
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
            <TooltipButton
              title={"Ghi chú cuộc họp"}
              onClick={() => {
                handleClickOpenDialogViewNote();
                refetchMeetingNote({ ...filtersMeetingNote, meetingId: row?.id });
              }}
            >
              <DescriptionOutlinedIcon color="inherit" />
            </TooltipButton>
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
    return data?.data || [];
  }, [data?.data]);

  const onAdd = async (value: any) => {
    const newValue = {
      id: rows?.length + 1,
      ...value,
    };
    const result = [...rows, newValue];
    setRows(result);
    setOpen(false);

    const secretary = [
      {
        userId: value?.secretary.value,
        memberType: "SECRETARY",
      },
    ];
    const assigned = value.assigned.map((elm: any) => ({
      userId: elm?.value,
      memberType: "MEMBER",
    }));
    const members = secretary.concat(assigned);
    const body = {
      title: value?.name,
      members,
      description: value?.description,
    };
    try {
      const response = await MeetingServices.createMeeting(body);
      if (response?.status === 201 && response?.data) {
        refetch();
        // showSuccess(response?.statusText)
      }
    } catch (error: any) {
      showError(error);
    }
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
        initialValues={{
          search: "",
        }}
        onSubmit={() => {}}
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
                    <ButtonCommon sx={{ padding: 1, minWidth: "auto", marginLeft: 1, borderRadius: 1 }} color="info" variant="contained">
                      <SearchOutlinedIcon /> Tìm kiếm
                    </ButtonCommon>
                  </Box>
                  <ButtonDialog
                    open={open}
                    additionCloseFunction={() => setDataRow(undefined)}
                    onToggle={(value) => {
                      
                      setOpen(value)}}
                    text={
                      <ButtonCommon sx={{ padding: 1, minWidth: "auto", marginLeft: 1, borderRadius: 1 }} color="error" variant="contained">
                        <AddIcon /> Thêm mới cuộc họp
                      </ButtonCommon>
                    }
                    content={<AddMeeting onAdd={onAdd} data={dataRow} />}
                  />
                </Box>
              </Box>
              <DataGrid
                rows={dataRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: paginationModel,
                  },
                }}
                onPaginationModelChange={(model) => handleChangePage(model?.page)}
                pageSizeOptions={[5]}
                checkboxSelection={false}
                disableRowSelectionOnClick
                hideFooterPagination={true}
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
            </>
          );
        }}
      </Formik>
    </NavigationBar>
  );
};

export default HomeScreen;

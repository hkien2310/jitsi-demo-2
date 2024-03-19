import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import queryString from "query-string";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../component/NavigationBar";
import ButtonDialog from "../../component/dialog/ButtonDialog";
import cacheKeys from "../../const/cachedKeys";
import { showError } from "../../helper/toast";
import useFiltersHandler from "../../hooks/useFilters";
import useGetListMeeting from "../../hooks/useGetListMeeting";
import AuthServices from "../../services/Auth.services";
import MeetingServices from "../../services/Meeting.services";
import { useGet, useSave } from "../../store/useStores";
import AddMeeting from "./AddMetting";
import { RoleMeeting } from "../../const/enum";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import useGetListMeetingNote from "../../hooks/useGetListMeetingNote";


const HomeScreen = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [noteViewOpen, setNoteViewOpen] = useState(false);
  const userInfo = AuthServices.getUserLocalStorage();

  const { filters, handleChangePage } = useFiltersHandler({ page: 0 });

  const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0 })
  const {data: dataListMeetingNote, refetch: refetchMeetingNote} = useGetListMeetingNote(filtersMeetingNote, {isTrigger: false})

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
    const newValue = rows?.filter((item: any) => item.id !== row.id);
    setRows(newValue);
    try {
      const response = await MeetingServices.deleteMeeting(1);

      if (response?.status === 201) {
        refetch();
      }
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
      renderCell: ({ row }) => {
        return (
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Box
              p={1}
            // sx={{  borderRadius: "10px", width: 100 }}
            // onClick={() => {
            //   const body = {
            //     room: row?.id,
            //     roomName: row?.name,
            //   };
            //   navigate(`/call?${queryString.stringify(body)}`);
            // }}
            >
              {row.description}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "decentralize",
      headerName: "Thành viên",
      flex: 1,
      editable: false,
      sortable: false,
      renderCell: ({ row }) => {
        console.log(row, "row111111");
        const members = row?.members.map((elm: any) => elm?.user.fullname);
        const stringMember = members.join(", ");
        return (
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Box
              p={1}
            // sx={{  borderRadius: "10px", width: 100 }}
            // onClick={() => {
            //   const body = {
            //     room: row?.id,
            //     roomName: row?.name,
            //   };
            //   navigate(`/call?${queryString.stringify(body)}`);
            // }}
            >
              {stringMember}
            </Box>
          </Box>
        );
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
      type: "number",
      width: 150,
      headerAlign: "center",
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
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Box
              p={1}
              sx={{ color: meetingColorStatus[`${row.status}`], borderRadius: "10px", width: 100 }}
            // onClick={() => {
            //   const body = {
            //     room: row?.id,
            //     roomName: row?.name,
            //   };
            //   navigate(`/call?${queryString.stringify(body)}`);
            // }}
            >
              {meetingStatus[`${row.status}`]}
            </Box>
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
            <Box
              p={1}
              sx={{ backgroundColor: "#6c757d", color: "white", borderRadius: "10px", width: 125 }}
              onClick={() => {
                handleClickOpenDialogViewNote()
                refetchMeetingNote({...filtersMeetingNote, meetingId: row?.id})
              }}
            >
              Meeting note
            </Box>
          );
        return (
          <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {/* {`${row?.creatorId}` === `${userInfo.id}` ? (
              <Box p={1} onClick={(row) => handleDelete(row)}>
                <DeleteIcon />
              </Box>
            ) : (
              <Box sx={{ width: "24px", height: "24px" }} m={1} />
            )} */}
            <Box
              p={1}
              sx={{ backgroundColor: "#17a2b8", color: "white", borderRadius: "10px", width: 125 }}
              onClick={() => {
                const body = {
                  room: row?.meetingCode,
                  roomName: row?.title,
                  meetingId: row?.id,
                  idRoleSecretary: row?.members?.find((e: any) => e?.memberType === RoleMeeting.SECRETARY)?.user?.id || null
                };
                navigate(`/call?${queryString.stringify(body)}`);
              }}
            >
              Tham gia
            </Box>
            {`${row?.creatorId}` === `${userInfo.id}` ? (
              <Box p={1} ml={1} sx={{ backgroundColor: "#0d801c", color: "white", borderRadius: "10px", width: 100 }} onClick={() => handleComplete(row)}>
                Hoàn thành
              </Box>
            ) : null}
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
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const renderListNote = () => {
    return <Box>

    </Box>
  }

  return (
    <NavigationBar>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Dialog
          open={noteViewOpen}
          TransitionComponent={Transition}
          keepMounted={false}
          onClose={handleCloseDialogViewNote}
          aria-describedby="alert-dialog-slide-description"
        >
          {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" >
              {renderListNote()}
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
        </Dialog>
        <ButtonDialog
          open={open}
          onToggle={(value) => setOpen(value)}
          text={
            <Box mb={1} p={1} sx={{ backgroundColor: "#945148", color: "white", borderRadius: "10px", display: "flex", alignItems: "center" }}>
              <AddIcon />
              Thêm mới cuộc họp
            </Box>
          }
          content={<AddMeeting onAdd={onAdd} />}
        />
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
      />
    </NavigationBar>
  );
};

export default HomeScreen;

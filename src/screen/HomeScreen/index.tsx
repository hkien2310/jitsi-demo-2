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

// const rowsDemo = [
//   { id: 1, name: 'Họp Daily', status: 1, description: 'Báo cáo hằng ngày' },
//   { id: 2, name: 'Họp Weekly', status: 1, description: 'Báo cáo hằng tuần' },
//   { id: 3, name: 'Họp Quý', status: 1, description: 'Tổng kết quý' },
//   { id: 4, name: 'Họp Team', status: 1, description: 'Team báo cáo' },
//   { id: 5, name: 'Họp Demo Sản phẩm', status: 1, description: 'Demo sản phẩm' },
//   { id: 6, name: 'Họp Chiến Lược', status: 1, description: 'Họp chiến lược' },
// ];

const HomeScreen = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const userInfo = AuthServices.getUserLocalStorage();

  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: 3,
  //   page: 0,
  // });
  const { filters, handleChangePage } = useFiltersHandler({ page: 0 });
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
    // const newValue = rows?.map((e: any) => {
    //   if (e?.id === row.id) {
    //     return { ...e, status: 0 };
    //   }
    //   return e;
    // });
    // setRows(newValue);

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
        const members = row?.members.map((elm) => elm?.user.fullname);
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
              onClick={() => {
                const body = {
                  room: row?.id,
                  roomName: row?.name,
                };
                navigate(`/call?${queryString.stringify(body)}`);
              }}
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
              sx={{ backgroundColor: "#6c757d", color: "white", borderRadius: "10px", width: 100 }}
              // onClick={() => {
              //   const body = {
              //     room: row?.id,
              //     roomName: row?.name,
              //   };
              //   navigate(`/call?${queryString.stringify(body)}`);
              // }}
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
              sx={{ backgroundColor: "#17a2b8", color: "white", borderRadius: "10px", width: 100 }}
              onClick={() => {
                const body = {
                  room: row?.id,
                  roomName: row?.name,
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
    const assigned = value.assigned.map((elm) => ({
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

  return (
    <NavigationBar>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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

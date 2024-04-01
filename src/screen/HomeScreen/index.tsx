import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box, Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import { green, red } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";
import { DataGrid } from "@mui/x-data-grid";
import { FastField, Formik } from "formik";
import queryString from "query-string";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageSource } from "../../assets/Image";
import ButtonCommon from "../../component/Button";
import NavigationBar from "../../component/NavigationBar";
import PaginationRounded from "../../component/Pagination";
import TextField from "../../component/TextField";
import DialogCommon from "../../component/dialog";
import DialogConfirm from "../../component/dialog/DialogConfirm";
import cacheKeys from "../../const/cachedKeys";
import { colors } from "../../const/colors";
import { RoleMeeting } from "../../const/enum";
import { calculateTotalPages, renderSTT } from "../../helper/function";
import { showError } from "../../helper/toast";
import useFiltersHandler from "../../hooks/useFilters";
import useGetListMeeting from "../../hooks/useGetListMeeting";
import useGetListMeetingNote from "../../hooks/useGetListMeetingNote";
import AuthServices from "../../services/Auth.services";
import MeetingServices from "../../services/Meeting.services";
import { useGet, useSave } from "../../store/useStores";
import AddMeeting from "./AddMetting";
import columnsMeet, { EnumMeetingStatus, meetingStatus } from "./columns";
// import typeMeetingOptions from "../../../AddMeeting"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import StatusSelect from "./component/StatusSelect";

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
  const [openStatusSelect, setOpenStatusSelect] = React.useState(false);

  const handleClose = () => {
    setOpenStatusSelect(false);
  };

  const handleOpen = () => {
    setOpenStatusSelect(true);
  };

  const { filters, handleChangePage } = useFiltersHandler({ page: 0, perPage: 10 });
  const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0 });
  const { data: dataListMeetingNote, refetch: refetchMeetingNote, setData: setNoteData } = useGetListMeetingNote(filtersMeetingNote, { isTrigger: false });
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
    setNoteData(undefined)
  };

  const openDetail = (row: any) => {
    setOpen(row);
    setDataRow(row);
  };

  const dataRows = React.useMemo(() => {
    return data?.data?.map((e, index) => ({ ...e, decentralize: e?.members?.map((elm: any) => elm?.user.fullname), stt: renderSTT(index, filters.page, filters.perPage) })) || [];
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
      <Box width={'50vw'}>
        {/* <Box sx={{ fontSize: "20px", fontWeight: "bold" }}>Ghi chú của cuộc họp</Box> */}
        <Box>
          {dataListMeetingNote?.data && dataListMeetingNote?.data?.length > 0 ? (
            dataListMeetingNote?.data?.map((e, index) => {
              return <Box pb={1} key={e?.id}>{`${index + 1}. ${e?.content}`}</Box>;
            })
          ) : (
            <Box>Cuộc họp này chưa có ghi chú</Box>
          )}
        </Box>
      </Box>
    );
  };

  const onClickDetail = (row: any) => {
    openDetail(row)
  }

  const onClickNote = (row: any) => {
    handleClickOpenDialogViewNote();
    refetchMeetingNote({ ...filtersMeetingNote, meetingId: row?.id });
  }

  const onClickDelete = (row: any) => {
    handleDelete(row)
  }

  const onJoin = (row: any) => {
    const body = {
      room: row?.meetingCode,
      roomName: row?.title,
      meetingId: row?.id,
      idRoleSecretary: row?.members?.find((e: any) => e?.memberType === RoleMeeting.SECRETARY)?.user?.id || null,
    };
    navigate(`/call?${queryString.stringify(body)}`);
  }

  const onComplete = (row: any) => {
    handleComplete(row)
  }

  return (
    <NavigationBar>
      <Formik
        innerRef={refFormik}
        initialValues={{
          search: "",
          status: '',
        }}
        onSubmit={(values) => {
          if (values.search) {
            refetch({ ...filters, textSearch: refFormik?.current?.values?.search });
          }
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <>
              <Box sx={{ display: "flex" }}>
                {noteViewOpen && (
                  <DialogCommon
                    open={noteViewOpen}
                    title={'Ghi chú của cuộc họp'}
                    handleClose={handleCloseDialogViewNote}
                    aria-describedby="alert-dialog-slide-description"
                    content={renderListNote()}
                  />

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
                      sx={{ padding: 1, minWidth: "auto", marginLeft: 1, backgroundColor: colors.background.secondary, borderRadius: '8px' }}
                      variant="contained"
                      onClick={() => handleSubmit()}
                    >
                      <img src={ImageSource.searchIcon} style={{ width: '24px', height: '24px' }} alt={''} />
                      {/* <SearchOutlinedIcon /> Tìm kiếm */}
                    </ButtonCommon>

                    <StatusSelect />
                  </Box>
                  <ButtonCommon
                    sx={{ padding: 1, minWidth: "auto", marginLeft: 1, borderRadius: 1, backgroundColor: colors.background.primary, textTransform: 'none', fontSize: '16px' }}
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
      <Box sx={{ width: '100%', flex: 1 }}>
        <DataGrid
          rows={dataRows}
          columns={columnsMeet({
            onClickDelete,
            onClickDetail,
            onClickNote,
            onComplete,
            onJoin,
          })}
          rowSpacingType={"margin"}
          hideFooter
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
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          columnBuffer={10}
          // hideFooterPagination={true}
          sx={{
            textAlign: 'center',
            color: colors.text.tableContent,
            "& .MuiDataGrid-columnHeaders": {
              // background: blue["A100"],
              "& .MuiDataGrid-columnSeparator": {
                display: 'none'
              },
              background: colors.background.tableHeader,
              color: 'black',
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "500",
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }} p={1}>
          <PaginationRounded totalPage={calculateTotalPages(data?.total || 0, filters.perPage)} page={filters.page + 1} handleChangePage={(page) => handleChangePage(page - 1)} />
        </Box>
      </Box>
      {open &&
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
      }
      {confirmDelete &&
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
      }
      {
        confirmComplete &&
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
      }
    </NavigationBar>
  );
};

export default HomeScreen;

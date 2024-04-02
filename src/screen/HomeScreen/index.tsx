import AddIcon from "@mui/icons-material/Add";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box, Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import { green } from "@mui/material/colors";
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
import columnsMeet, { EnumMeetingStatus } from "./columns";
// import typeMeetingOptions from "../../../AddMeeting"
import StatusSelect from "./component/StatusSelect";
import TableFilterSearch from "../../component/TableFilterSearch";

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

  const { filters, handleChangePage } = useFiltersHandler({
    page: 0,
    perPage: 10,
  });
  const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0 });
  const {
    data: dataListMeetingNote,
    refetch: refetchMeetingNote,
    setData: setNoteData,
  } = useGetListMeetingNote(filtersMeetingNote, { isTrigger: false });
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
      const response = await MeetingServices.updateMeeting(
        completeRef.current?.id,
        body
      );
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
    setNoteData(undefined);
  };

  const openDetail = (row: any) => {
    setOpen(row);
    setDataRow(row);
  };

  const dataRows = React.useMemo(() => {
    return (
      data?.data?.map((e, index) => ({
        ...e,
        decentralize: e?.members?.map((elm: any) => elm?.user.fullname),
        stt: renderSTT(index, filters.page, filters.perPage),
      })) || []
    );
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
      <Box width={"50vw"}>
        {/* <Box sx={{ fontSize: "20px", fontWeight: "bold" }}>Ghi chú của cuộc họp</Box> */}
        <Box>
          {dataListMeetingNote?.data &&
          dataListMeetingNote?.data?.length > 0 ? (
            dataListMeetingNote?.data?.map((e, index) => {
              return (
                <Box pb={1} key={e?.id}>{`${index + 1}. ${e?.content}`}</Box>
              );
            })
          ) : (
            <Box>Cuộc họp này chưa có ghi chú</Box>
          )}
        </Box>
      </Box>
    );
  };

  const onClickDetail = (row: any) => {
    openDetail(row);
  };

  const onClickNote = (row: any) => {
    handleClickOpenDialogViewNote();
    refetchMeetingNote({ ...filtersMeetingNote, meetingId: row?.id });
  };

  const onClickDelete = (row: any) => {
    handleDelete(row);
  };

  const onJoin = (row: any) => {
    const body = {
      room: row?.meetingCode,
      roomName: row?.title,
      meetingId: row?.id,
      idRoleSecretary:
        row?.members?.find((e: any) => e?.memberType === RoleMeeting.SECRETARY)
          ?.user?.id || null,
    };
    navigate(`/call?${queryString.stringify(body)}`);
  };

  const onComplete = (row: any) => {
    handleComplete(row);
  };

  return (
    <NavigationBar>
      <TableFilterSearch
        columns={columnsMeet({
          onClickDelete,
          onClickDetail,
          onClickNote,
          onComplete,
          onJoin,
        })}
        dataRows={dataRows}
        onSearchAndFilter={(values, filter) => {
          refetch({
            ...filter,
            textSearch: values.search,
            status: values.status ? [values.status] : undefined,
          });
        }}
        searchPlaceholder="Nhập tên cuộc họp"
        rowCount={data?.total || 0}
        rightTitle="Thêm mới cuộc họp"
        onClickRight={() => setOpen(true)}
        filterComponent={({ values, setFieldValue, handleSubmit }) => {
          return (
            <Box sx={{ height: "100%" }}>
              <StatusSelect
                value={values.status as EnumMeetingStatus}
                onChange={(value) => {
                  setFieldValue("status", value);
                  if (values.status === value) {
                    return;
                  }
                  handleSubmit();
                }}
              />
            </Box>
          );
        }}
      />
      {noteViewOpen && (
        <DialogCommon
          open={noteViewOpen}
          title={"Ghi chú của cuộc họp"}
          handleClose={handleCloseDialogViewNote}
          aria-describedby="alert-dialog-slide-description"
          content={renderListNote()}
        />
      )}
      {open && (
        <DialogCommon
          title={dataRow ? "Chi tiết cuộc họp" : "Thêm mới cuộc họp"}
          open={open}
          handleClose={() => {
            setOpen(false);
            setDataRow(undefined);
          }}
          content={
            <Box sx={{ width: "55vw" }}>
              <AddMeeting
                refetchList={refetch}
                onAdd={onAdd}
                data={dataRow}
                onClose={() => setOpen(false)}
              />
            </Box>
          }
        />
      )}
      {confirmDelete && (
        <DialogConfirm
          isDelete
          handleClose={() => {
            setConfirmDelete(false);
          }}
          open={confirmDelete}
          content={
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                pr: "40px",
                pl: "40px",
                pt: "24px",
                pb: "24px",
              }}
            >
              <Box sx={{ color: "#243141", fontWeight: 600 }}>Cảnh báo</Box>
              <Box
                sx={{
                  color: "rgba(84, 89, 94, 0.6)",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Bạn có muốn chắc chắc muốn xóa phiên họp này không ?
              </Box>
            </Box>
          }
          children={
            <Box sx={{ pr: "40px", pl: "40px", pb: "36px" }}>
              <ButtonCommon
                variant="contained"
                onClick={() => setConfirmDelete(false)}
                sx={{ fontWeight: "550", width: "100%" }}
                color="secondary"
              >
                Xoá
              </ButtonCommon>
              <ButtonCommon
                variant="outlined"
                onClick={handleConfirmDelete}
                sx={{ width: "100%", mt: "16px" }}
              >
                Huỷ bỏ
              </ButtonCommon>
            </Box>
          }
        />
      )}
      {confirmComplete && (
        <DialogConfirm
          handleClose={() => {
            setConfirmComplete(false);
          }}
          open={confirmComplete}
          content={
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                pr: "40px",
                pl: "40px",
                pt: "24px",
                pb: "24px",
              }}
            >
              <Box sx={{ color: "#243141", fontWeight: 600 }}>Cảnh báo</Box>
              <Box
                sx={{
                  color: "rgba(84, 89, 94, 0.6)",
                  fontSize: 14,
                  fontWeight: 400,
                }}
              >
                Bạn chắc chắn muốn hoàn thành phiên họp này ?
              </Box>
            </Box>
          }
          children={
            <Box sx={{ pr: "40px", pl: "40px", pb: "36px" }}>
              <ButtonCommon variant="contained" onClick={handleConfirmComplete} sx={{ fontWeight: "550", width: "100%" }} color="secondary">
                Hoàn thành
              </ButtonCommon>
              <ButtonCommon variant="outlined" onClick={() => setConfirmComplete(false)} sx={{ width: "100%", mt: "16px" }}>
                Huỷ bỏ
              </ButtonCommon>
            </Box>
          }
        />
      )}
    </NavigationBar>
  );
};

export default HomeScreen;

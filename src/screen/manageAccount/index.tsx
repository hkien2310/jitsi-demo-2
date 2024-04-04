import { Box } from "@mui/material";
import DialogCommon from "../../component/dialog";
import NavigationBar from "../../component/NavigationBar";
import TableFilterSearch from "../../component/TableFilterSearch";
import columnsAcc from "./columns";
import React, { useRef, useState } from "react";
import AddAccount from "./addAccount";
import useGetListUser from "../../hooks/useGetListUser";
import useFiltersHandler from "../../hooks/useFilters";
import { renderSTT } from "../../helper/function";
import UserServices from "../../services/User.services";
import { showError } from "../../helper/toast";
import ButtonCommon from "../../component/Button";
import DialogConfirm from "../../component/dialog/DialogConfirm";
import EditAccount from "./editAccount";

const ManageAccountScreen = () => {
  const [open, setOpen] = useState(false);
  const { filters } = useFiltersHandler({ page: 0 });
  const { data, refetch } = useGetListUser(filters);
  const [userId, setUserId] = useState();
  const [dataRow, setDataRow] = useState();
  const deleteRef = useRef<any>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const dataRows = React.useMemo(() => {
    return (
      data?.data?.map((e, index) => ({
        ...e,
        // decentralize: e?.members?.map((elm: any) => elm?.user.fullname),
        stt: renderSTT(index, filters.page, filters.perPage),
      })) || []
    );
  }, [data?.data, filters.page, filters.perPage]);

  const handleConfirmDelete = async () => {
    try {
      await UserServices.deleteUser(deleteRef.current?.id);
      refetch();
      setConfirmDelete(false);
    } catch (error: any) {
      showError(error);
    }
  };
  const handleDelete = async (row: any) => {
    deleteRef.current = row;
    setConfirmDelete(true);
  };

  const onClickDelete = (row: any) => {
    handleDelete(row);
  };
  const onClickDetail = (row: any) => {
    setUserId(row.id);
    setOpen(true);
    setDataRow(row);
  };
  const onClickEdit = (row: any) => {
    setIsEdit(true);
    setDataRow(row);
    setUserId(row.id);
  };

  return (
    <NavigationBar>
      <Box
        sx={{
          fontSize: "24px",
          textAlign: "left",
          color: "#333333",
          fontWeight: 500,
          mb: 1,
        }}
      >
        Danh sách tài khoản
      </Box>
      <TableFilterSearch
        columns={columnsAcc({
          onClickDelete,
          onClickDetail,
          onClickEdit,
        })}
        dataRows={dataRows || []}
        onSearchAndFilter={(values, filter) => {
          refetch({
            ...filter,
            textSearch: values.search,
            status: values.status ? [values.status] : undefined,
          });
        }}
        searchPlaceholder="Nhập tên tài khoản"
        rowCount={data?.total || 0}
        rightTitle="Thêm mới"
        onClickRight={() => {
          setOpen(true);
          setDataRow(undefined);
        }}
        // filterComponent={({ values, setFieldValue, handleSubmit }) => {
        //   return (
        //     <Box sx={{ height: "100%" }}>
        //       <StatusSelect
        //         value={values.status as EnumMeetingStatus}
        //         onChange={(value) => {
        //           setFieldValue("status", value);
        //           if (values.status === value) {
        //             return;
        //           }
        //           handleSubmit();
        //         }}
        //       />
        //     </Box>
        //   );
        // }}
      />
      {open && (
        <DialogCommon
          title={dataRow ? "Chi tiết tài khoản" : "Thêm mới tài khoản"}
          open={open}
          handleClose={() => {
            setOpen(false);
            setDataRow(undefined);
            setUserId(undefined);
          }}
          sx={{ pt: "23px", pb: "25px" }}
          content={
            <Box sx={{ width: "35vw" }}>
              <AddAccount
                id={userId}
                refetchList={refetch}
                onClose={() => {
                  setOpen(false);
                  setDataRow(undefined);
                  setUserId(undefined);
                }}
              />
            </Box>
          }
        />
      )}
      {isEdit && (
        <DialogCommon
          title={"Chỉnh sửa tài khoản"}
          open={isEdit}
          handleClose={() => {
            setIsEdit(false);
            setDataRow(undefined);
            setUserId(undefined);
          }}
          sx={{ pt: "23px", pb: "25px" }}
          content={
            <Box sx={{ width: "35vw" }}>
              <EditAccount
                id={userId}
                refetchList={refetch}
                onClose={() => {
                  setIsEdit(false);
                  setDataRow(undefined);
                  setUserId(undefined);
                }}
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
                Bạn có muốn chắc chắc muốn xóa tài khoản này không?
              </Box>
            </Box>
          }
          children={
            <Box sx={{ pr: "40px", pl: "40px", pb: "36px" }}>
              <ButtonCommon variant="contained" onClick={handleConfirmDelete} sx={{ fontWeight: "550", width: "100%" }} color="secondary">
                Xoá
              </ButtonCommon>
              <ButtonCommon variant="outlined" onClick={() => setConfirmDelete(false)} sx={{ width: "100%", mt: "16px" }}>
                Huỷ bỏ
              </ButtonCommon>
            </Box>
          }
        />
      )}
    </NavigationBar>
  );
};
export default ManageAccountScreen;

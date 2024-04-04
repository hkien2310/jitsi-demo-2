import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import NavigationBar from "../../component/NavigationBar";
import TableFilterSearch from "../../component/TableFilterSearch";
import DialogCommon from "../../component/dialog";
import AddRole from "./addRole";
import columnsRole from "./columns";
import useFiltersHandler from "../../hooks/useFilters";
import { renderSTT } from "../../helper/function";
import { IUserGroupItem } from "../../interface/usergroup";
import cacheKeys from "../../const/cachedKeys";
import { useGet, useSave } from "../../store/useStores";
import ViewDetailRole from "./viewDetailRole";
import useGetListUserGroup from "../../hooks/useGetListUserGroup";
import ButtonCommon from "../../component/Button";
import DialogConfirm from "../../component/dialog/DialogConfirm";
import { showError } from "../../helper/toast";
import UserGroupService from "../../services/UserGroup.service";

const ManageRoleScreen = () => {
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemSelected, setItemSelected] = useState<IUserGroupItem>();
  const [itemSelectIsEdit, setItemSelectedIsEdit] = useState(false);
  const save = useSave()
  const searchUserGroup = useGet(cacheKeys.SEARCH_USER_GROUP)

  const { filters, handleChangePage } = useFiltersHandler({
    page: 0,
    perPage: 10
  })
  const { data, isLoading, refetch } = useGetListUserGroup(filters)
  const dataRows = React.useMemo(() => {
    return (
      data?.data?.map((e, index) => ({
        ...e,
        stt: renderSTT(index, filters.page, filters.perPage),
      })) || []
    );
  }, [data?.data, filters.page, filters.perPage]);

  const onClickDelete = (row: any) => {
    setItemSelected(row)
    setConfirmDelete(true)
  };
  const onClickDetail = (row: any) => {
    setItemSelected(row)
    setOpenDetail(true)
  };
  const onClickEdit = (row: any) => {
    setItemSelected(row)
    setOpenDetail(true)
    setItemSelectedIsEdit(true)
  };

  const handleConfirmDelete = async () => {
    try {
      await UserGroupService.deleteUserGroup(itemSelected?.id || 0);
      setConfirmDelete(false);
      refetch({
        ...filters,
        textSearch: searchUserGroup,
      });
    } catch (error: any) {
      showError(error);
    } finally {

    }
  };

  useEffect(() => {
    save(cacheKeys.LOADING_APP, isLoading)
  }, [isLoading, save])

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
        Danh sách nhóm quyền
      </Box>
      <TableFilterSearch
        columns={columnsRole({
          onClickDelete,
          onClickDetail,
          onClickEdit,
        })}
        rowCount={data?.total || 0}
        dataRows={dataRows}
        onSearchAndFilter={(values, filter) => {
          refetch({
            ...filters,
            textSearch: values.search,
          });
          save(cacheKeys.SEARCH_USER_GROUP, values.search)
        }}
        filters={filters}
        handleChangePage={handleChangePage}
        searchPlaceholder="Nhập tên cuộc họp"
        rightTitle="Thêm mới"
        onClickRight={() => setOpen(true)}
      />
      {open && (
        <DialogCommon
          title={"Thêm mới nhóm quyền"}
          open={open}
          handleClose={() => {
            setOpen(false);
            // setDataRow(undefined);
          }}
          sx={{ pt: '23px', pb: '25px' }}
          content={
            <Box sx={{ width: "55vw" }}>
              <AddRole onClose={() => setOpen(false)} onSuccess={() => refetch({
                ...filters,
                textSearch: searchUserGroup,
              })} />
              {/* <AddMeeting refetchList={refetch} onAdd={onAdd} data={dataRow} onClose={() => setOpen(false)} /> */}
            </Box>
          }
        />
      )}
      {openDetail && (
        <DialogCommon
          title={"Chi tiết nhóm quyền"}
          open={openDetail}
          handleClose={() => {
            setOpenDetail(false);
            // setDataRow(undefined);
          }}
          sx={{ pt: '23px', pb: '25px' }}
          content={
            <Box sx={{ width: "55vw" }}>
              <ViewDetailRole
                isEdit={itemSelectIsEdit}
                idRole={itemSelected?.id || 0}
                onClose={() => {
                  setOpenDetail(false)
                  setItemSelected(undefined)
                  setItemSelectedIsEdit(false)
                }}
                onSuccess={() => refetch({
                  ...filters,
                  textSearch: searchUserGroup,
                })}
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
                Bạn có muốn chắc chắc muốn xóa nhóm quyền này không ?
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
export default ManageRoleScreen;

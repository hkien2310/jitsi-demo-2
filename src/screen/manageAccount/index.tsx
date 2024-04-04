import { Box } from "@mui/material";
import DialogCommon from "../../component/dialog";
import NavigationBar from "../../component/NavigationBar";
import TableFilterSearch from "../../component/TableFilterSearch";
import columnsAcc from "./columns";
import React, { useState } from "react";
import AddAccount from "./addAccount";
import useGetListUser from "../../hooks/useGetListUser";
import useFiltersHandler from "../../hooks/useFilters";
import { renderSTT } from "../../helper/function";

const ManageAccountScreen = () => {
  const [open, setOpen] = useState(false);
  const { filters } = useFiltersHandler({ page: 0 });
  const { data, refetch } = useGetListUser(filters);
  const dataRows = React.useMemo(() => {
    return ( 
      data?.data?.map((e, index) => ({
        ...e,
        // decentralize: e?.members?.map((elm: any) => elm?.user.fullname),
        stt: renderSTT(index, filters.page, filters.perPage),
      })) || []
    )
  }, [data?.data, filters.page, filters.perPage]);
  // console.log(data, 'data1223______')
  const onClickDelete = () => {
    console.log("123");
  };
  const onClickDetail = () => {
    console.log("123");
  };
  const onClickNote = () => {
    console.log("123");
  };
  const onComplete = () => {
    console.log("123");
  };
  const onJoin = () => {
    console.log("123");
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
          onClickNote,
          onComplete,
          onJoin,
        })}
        dataRows={dataRows || []}
        onSearchAndFilter={(values, filter) => {
          //   refetch({
          //     ...filter,
          //     textSearch: values.search,
          //     status: values.status ? [values.status] : undefined,
          //   });
        }}
        searchPlaceholder="Nhập tên tài khoản"
        rowCount={data?.total || 0}
        rightTitle="Thêm mới"
        onClickRight={() => setOpen(true)}
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
          title={!data ? "Chi tiết tài khoản" : "Thêm mới tài khoản"}
          open={open}
          handleClose={() => {
            setOpen(false);
            // setDataRow(undefined);
          }}
          sx={{ pt: "23px", pb: "25px" }}
          content={
            <Box sx={{ width: "35vw" }}>
              <AddAccount refetchList={refetch} onClose={() => setOpen(false)}/>
              {/* <AddMeeting refetchList={refetch} onAdd={onAdd} data={dataRow} onClose={() => setOpen(false)} /> */}
            </Box>
          }
        />
      )}
    </NavigationBar>
  );
};
export default ManageAccountScreen;

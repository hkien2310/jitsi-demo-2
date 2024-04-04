import { Box } from "@mui/material";
import { useState } from "react";
import NavigationBar from "../../component/NavigationBar";
import TableFilterSearch from "../../component/TableFilterSearch";
import DialogCommon from "../../component/dialog";
import AddRole from "./addRole";
import columnsRole from "./columns";
const dataMock = [
  {
    nameGroup: "Tên nhóm quyền",
    codeGroup: "Họp thường kỳ tháng 3",
    id: 1,
    stt: 1,
  },
  {
    nameGroup: "Tên nhóm quyền",
    codeGroup: "Họp thường kỳ tháng 4",
    id: 2,
    stt: 2,
  },
  {
    nameGroup: "Tên nhóm quyền",
    codeGroup: "Họp thường kỳ tháng 5",
    id: 3,
    stt: 3,
  },
  {
    nameGroup: "Tên nhóm quyền",
    codeGroup: "Họp thường kỳ tháng 3",
    id: 4,
    stt: 4,
  },
]
const ManageRoleScreen = () => {
  const [open, setOpen] = useState(false);

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
        Danh sách nhóm quyền
      </Box>
      <TableFilterSearch
        columns={columnsRole({
          onClickDelete,
          onClickDetail,
          onClickNote,
          onComplete,
          onJoin,
        })}
        dataRows={dataMock}
        onSearchAndFilter={(values, filter) => {
          //   refetch({
          //     ...filter,
          //     textSearch: values.search,
          //     status: values.status ? [values.status] : undefined,
          //   });
        }}
        searchPlaceholder="Nhập tên cuộc họp"
        // rowCount={data?.total || 0}
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
          title={!dataMock ? "Chi tiết nhóm quyền" : "Thêm mới nhóm quyền"}
          open={open}
          handleClose={() => {
            setOpen(false);
            // setDataRow(undefined);
          }}
          sx={{ pt: '23px', pb: '25px' }}
          content={
            <Box sx={{ width: "55vw" }}>
              <AddRole />
              {/* <AddMeeting refetchList={refetch} onAdd={onAdd} data={dataRow} onClose={() => setOpen(false)} /> */}
            </Box>
          }
        />
      )}
    </NavigationBar>
  );
};
export default ManageRoleScreen;

import { Box, Grid } from "@mui/material";
import { FastField, Formik } from "formik";
import LabelCommon from "../../../component/label";
import TextField from "../../../component/TextField";
import SelectRole from "./SelectRole";
import CheckBoxField from "../../../component/checkBox";
import { green, indigo } from "@mui/material/colors";
import ButtonCommon from "../../../component/Button";
import { ImageSource } from "../../../assets/Image";

const AddRole = () => {
  // !Init
  const initial: any = {
    nameGroup: "",
    permission: [],
    selectPermission: "",
    // description: dataRow?.description,
    // assigned: filterMember,
    // agenda: dataRow?.syllabusContent || "",
    // startTime: dataRow?.startTime,
    // endTime: dataRow?.endTime,
    // location: dataRow?.location,
    // secretary: filterSecretary,
    // type: dataRow?.type || "",
    // acceptUploadFile: Boolean(dataRow?.syllabusFileName) || false,
    // uploadFile: dataRow ? file : null,
  };
  // !DataMock
  const dataRole = [
    {
      name: "Quyền chia sẻ file",
      id: 1,
    },
    {
      name: "Quyền thêm cuộc họp",
      id: 2,
    },
    {
      name: "Quyền duyệt thành viên",
      id: 3,
    },
    {
      name: "Quyền duyệt thành viên",
      id: 4,
    },
    {
      name: "Quyền thêm cuộc họp",
      id: 5,
    },
  ];

  // !Function
  const onClose = () => {};

  // !Render
  return (
    <Box>
      <Formik initialValues={initial} onSubmit={() => {}}>
        {({ values, setFieldValue, handleSubmit, errors }) => {
          console.log(values, "valuesvaluesvalues1212");
          return (
            <>
              <Grid>
                <LabelCommon label="Tên nhóm" />
                <FastField
                  component={TextField}
                  name="nameGroup"
                  fullWidth
                  required
                  placeholder="Nhập tên nhóm quyền"
                  //   disabled={isDetail}
                  sx={{ mb: "24px" }}
                />
              </Grid>

              <Grid container spacing={8}>
                <Grid item xs={6}>
                  <LabelCommon label="Quyền có thể sử dụng" />
                  <Box sx={{ borderRadius: "10px", border: "1px solid #E7E7E7" }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid #E7E7E7" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mr: "8px" }}>
                        <FastField
                          //   disabled={isDetail}
                          name="selectPermission"
                          component={CheckBoxField}
                          checkedIcon={<img src={ImageSource.tickSquare} style={{ height: "14px", width: "14px" }} />}
                          icon={<img src={ImageSource.box} style={{ height: "14px", width: "14px" }} />}
                          sx={{ mr: "8px" }}
                        />
                        <FastField
                          size="small"
                          component={TextField}
                          name="search"
                          fullWidth
                          required
                          placeholder="Nhập tên quyền"
                          //   disabled={isDetail}
                        />
                      </Box>
                      <ButtonCommon
                        variant="contained"
                        color="secondary"
                        type="submit"
                        size="small"
                        sx={{ p: 0, minWidth: "auto", height: "36px", width: "40px", borderRadius: "8px" }}
                      >
                        <img src={ImageSource.searchIcon} style={{ width: "20px", height: "20px" }} alt={""} />
                      </ButtonCommon>
                    </Box>
                    <Box sx={{ pl: "10px", pt: "10px", pb: "8px", pr: "10px" }}>
                      {dataRole.map((elm, index) => {
                        return (
                          <FastField
                            setFieldValue={(value) => {
                              console.log(value, "value----");
                            }}
                            //   disabled={isDetail}
                            name={`permission[${index}}`}
                            component={CheckBoxField}
                            checkedIcon={<img src={ImageSource.tickSquare} style={{ height: "14px", width: "14px", mb: "16px" }} />}
                            icon={<img src={ImageSource.box} style={{ height: "14px", width: "14px", mb: "16px" }} />}
                            label={elm?.name}
                            sxContainer={{
                              pb: "12px",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} sx={{ display: "flex" }}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{}}>Các quyền đã được gán</Box>
                    <Box sx={{ boxShadow: "-10px 10px 0px 0px #E6EAEE", border: "1px solid #E7E7E7", borderRadius: "10px" }}>
                      {dataRole.map((elm, idx) => {
                        return (
                          <Box key={idx} sx={{ borderBottom: "1px solid #E7E7E7", pt: "12px", pb: "12px", pl: "40px" }}>
                            {elm.name}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }} width="100%">
                <ButtonCommon
                  sx={{
                    // height: "47px",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                  variant="outlined"
                  onClick={onClose}
                >
                  Huỷ
                </ButtonCommon>
                <ButtonCommon
                  sx={{
                    // height: "47px",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    ml: 1,
                  }}
                  variant="contained"
                  onClick={() => handleSubmit()}
                >
                  Tạo mới
                </ButtonCommon>
              </Box>
            </>
          );
        }}
      </Formik>
    </Box>
  );
};
export default AddRole;

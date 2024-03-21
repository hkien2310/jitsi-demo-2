import { Box, Button, Grid } from "@mui/material";
import { green, indigo } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FastField, Field, Formik } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import AutoCompleteField from "../../../component/Autocomplete";
import TextField from "../../../component/TextField";
import UploadFile from "../../../component/UploadFile";
import CheckBoxField from "../../../component/checkBox";
import DateTimePickerField from "../../../component/dateTime";
import LabelCommon from "../../../component/label";
import Tiny from "../../../component/tinyMce";
import { uploadFile } from "../../../helper/function";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListUser from "../../../hooks/useGetListUser";
import AuthServices from "../../../services/Auth.services";
export const typeMeetingOptions = [
  {
    label: "Họp giao ban",
    value: 1,
  },
  {
    label: "Phiên họp thường trực",
    value: 2,
  },
  {
    label: "Thảo luận tổ",
    value: 3,
  },
  {
    label: "Họp thẩm tra",
    value: 4,
  },
  {
    label: "Họp thường kỳ tháng",
    value: 5,
  },
  {
    label: "Họp phiên chính thức",
    value: 6,
  },
  {
    label: "Họp phiên trù bị",
    value: 7,
  },
  {
    label: "Họp nội dung khác",
    value: 8,
  },
];
interface IProps {
  onAdd: (value: any) => void;
  data: any;
  onClose: () => void;
}

const validationSchema = () => {
  return Yup.object().shape({
    // name: Yup.string().required("Đây là trường bắt buộc"),
    // description: Yup.string().required("Đây là trường bắt buộc"),
    // assigned: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
    // agenda: Yup.string().required("Đây là trường bắt buộc"),
    // // startTime: Yup.string().required("Đây là trường bắt buộc"),
    // // endTime: Yup.string().required("Đây là trường bắt buộc"),
    // place: Yup.string().required("Đây là trường bắt buộc"),
    // secretary: Yup.object().required("Đây là trường bắt buộc"),
    // type: Yup.string().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
  });
};

const AddMeeting = (props: IProps) => {
  const { onAdd, data: dataRow, onClose } = props;
  const { filters } = useFiltersHandler({ page: 0 });
  const { data } = useGetListUser(filters);
  const userInfo = AuthServices.getUserLocalStorage();
  const ref = useRef<any>();

  const listOptions = React.useMemo(() => {
    return (
      data?.data?.map((e) => {
        return {
          label: e?.fullname,
          value: e?.id,
        };
      }) || []
    );
  }, [data?.data]);

  const isDetail = Boolean(dataRow);
  const filterMember = dataRow
    ? dataRow?.members
        .filter((elm) => elm?.memberType !== "SECRETARY")
        .map((e) => {
          return {
            label: e?.user.fullname,
            value: e?.user.id,
          };
        })
    : [
        {
          value: userInfo?.id,
          label: userInfo?.fullname,
        },
      ];
  const handleChooseFile = async (files: File[] | null) => {
    ref?.current?.setFieldValue("uploadFile", files?.[0]);
    // if (files) {
    //   files?.forEach(async (e) => {
    //     await uploadFile({
    //       file: e,
    //       meetingId: "",
    //       // onSuccess: () => {
    //       //   refetchListDocument();
    //       // },
    //     });
    //   });
    // }
  };
  const filterSecretary = dataRow
    ? dataRow?.members
        .filter((elm: any) => elm?.memberType === "SECRETARY")
        .map((e: any) => {
          return {
            label: e?.user.fullname,
            value: e?.user.id,
          };
        })?.[0]
    : "";
  const initial = {
    name: dataRow?.title,
    status: 1,
    description: dataRow?.description,
    assigned: filterMember,
    agenda: "",
    startTime: "",
    endTime: "",
    location: "",
    secretary: filterSecretary,
    type: undefined,
    acceptUploadFile: false,
    uploadFile: [],
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Formik
          initialValues={initial}
          validationSchema={validationSchema}
          onSubmit={(values, help) => {
            onAdd(values);
            help?.resetForm();
          }}
          innerRef={ref}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, errors }) => {
            return (
              <>
                <Grid container spacing={2}>
                  <Box
                    sx={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: indigo[50],
                      borderRadius: 2,
                      borderStyle: "solid",
                      position: "relative",
                      margin: 4,
                      bgcolor: "white",
                      boxShadow: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "white",
                        fontWeight: 600,
                        color: indigo[500],
                        position: "absolute",
                        top: -12,
                        left: 24,
                        width: 200,
                        textAlign: "center",
                      }}
                    >
                      {isDetail ? "Chi tiết phiên họp" : "Thêm mới phiên họp"}
                    </Box>
                    <Grid sx={{ marginRight: 4, marginTop: 5, marginLeft: 4, marginBottom: 4 }}>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Tiêu đề" />
                        <FastField
                          component={TextField}
                          sx={{ flex: 5 }}
                          name={"name"}
                          fullWidth
                          required
                          placeholder="Nhập tiêu đề cuộc họp"
                          disabled={isDetail}
                        />
                      </Grid>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Loại phiên họp" />
                        <Box sx={{ flex: 5 }}>
                          <FastField options={typeMeetingOptions} component={AutoCompleteField} name={"type"} required disabled={isDetail} />
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Nội dung" />
                        <FastField
                          component={TextField}
                          multiline
                          rows={2}
                          name={"description"}
                          sx={{ flex: 5 }}
                          required
                          placeholder="Vui lòng nhập nội dung"
                          disabled={isDetail}
                        />
                      </Grid>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Chương trình họp" />
                        <Box sx={{ flex: 5 }}>
                          <Box sx={{ pb: !values?.acceptUploadFile ? 2 : 0 }}>
                            {!values?.acceptUploadFile ? <FastField component={Tiny} name="agenda" disabled={isDetail} /> : undefined}
                          </Box>
                          <Box>
                            <FastField
                              disabled={isDetail}
                              name="acceptUploadFile"
                              component={CheckBoxField}
                              label={"Chọn tải file"}
                              sxContainer={{
                                gap: "4px",
                                ".Mui-checked": {
                                  color: `${green[800]} !important`,
                                },
                              }}
                            />
                          </Box>
                          {values?.acceptUploadFile ? <UploadFile onFileSelected={handleChooseFile} /> : undefined}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, display: "grid", pb: 2 }}>
                        <Box sx={{ display: "flex" }}>
                          <LabelCommon label="Thời gian từ" />
                          <FastField
                            component={DateTimePickerField}
                            name="startTime"
                            required
                            sx={{ flex: 2, "& div": { borderRadius: "0.5rem" } }}
                            placeholder="Chọn thời gian bắt đầu"
                            disabled={isDetail}
                            // formatCustom={'YYYY-MM-DD HH:mm:ss'}
                            isDayjs
                          />
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <LabelCommon label="Thời gian hết hạn" />
                          <FastField
                            component={DateTimePickerField}
                            isDayjs
                            name="endTime"
                            sx={{ flex: 2, "& div": { borderRadius: "0.5rem" } }}
                            required
                            placeholder="Chọn thời gian kết thúc"
                            disabled={isDetail}
                            // formatCustom={'YYYY-MM-DD HH:mm:ss'}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Địa điểm" />
                        <FastField sx={{ flex: 5 }} component={TextField} name={"location"} required placeholder="Nhập địa điểm họp" disabled={isDetail} />
                      </Grid>

                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Thành viên" />
                        <Box sx={{ flex: 5 }}>
                          <Field
                            component={AutoCompleteField}
                            name="assigned"
                            multiple
                            required
                            onChangeCustomize={(e: any, value: any) => {
                              setFieldValue("assigned", value);
                            }}
                            options={listOptions}
                            disabled={isDetail}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Thư ký" />
                        <Box sx={{ flex: 5 }}>
                          <Field
                            component={AutoCompleteField}
                            name="secretary"
                            fullWidth
                            required
                            onChangeCustomize={(e: any, value: any) => {
                              setFieldValue("secretary", value);
                            }}
                            options={listOptions}
                            disabled={isDetail}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  {!isDetail ? (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }} width="100%">
                      <Button variant="outlined" onClick={onClose} sx={{ fontWeight: "600" }}>
                        Huỷ
                      </Button>
                      <Button variant="contained" onClick={() => handleSubmit()} sx={{ fontWeight: "600", ml: 1 }}>
                        Tạo mới
                      </Button>
                    </Box>
                  ) : (
                    <Box />
                  )}
                  {/* {isDetail ? (
                    <Box />
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }} width="100%">
                      <Button variant="outlined" onClick={handleCancel} sx={{ fontWeight: "600" }}>
                        Huỷ
                      </Button>
                      <Button variant="contained" onClick={() => handleSubmit()} sx={{ fontWeight: "600", ml: 1 }}>
                        Tạo mới
                      </Button>
                    </Box>
                  )} */}
                </Grid>
              </>
            );
          }}
        </Formik>
      </LocalizationProvider>
    </Box>
  );
};

export default AddMeeting;

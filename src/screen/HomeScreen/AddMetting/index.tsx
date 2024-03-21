import { Box, Checkbox, Grid } from "@mui/material";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FastField, Field, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import AutoCompleteField from "../../../component/Autocomplete";
import ButtonCommon from "../../../component/Button";
import TextField from "../../../component/TextField";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListUser from "../../../hooks/useGetListUser";
import AuthServices from "../../../services/Auth.services";
import { error } from "console";
import Tiny from "../../../component/tinyMce";
import LabelCommon from "../../../component/label";
import { indigo } from "@mui/material/colors";
import DialogCommon from "../../../component/dialog";
import UploadFile from "../../../component/UploadFile";
import { uploadFile } from "../../../helper/function";

interface IProps {
  onAdd: (value: any) => void;
  data: any;
  handleCancel: () => void;
}

const validationSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Đây là trường bắt buộc"),
    description: Yup.string().required("Đây là trường bắt buộc"),
    assigned: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
    agenda: Yup.string().required("Đây là trường bắt buộc"),
    // startTime: Yup.string().required("Đây là trường bắt buộc"),
    // endTime: Yup.string().required("Đây là trường bắt buộc"),
    place: Yup.string().required("Đây là trường bắt buộc"),
    secretary: Yup.string().required("Đây là trường bắt buộc"),
    type: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
  });
};

const AddMeeting = (props: IProps) => {
  const { onAdd, data: dataRow, handleCancel } = props;
  const { filters } = useFiltersHandler({ page: 0 });
  const { data } = useGetListUser(filters);
  const userInfo = AuthServices.getUserLocalStorage();
  const [checkBoxUploadFile, setCheckBoxUploadFile] = useState(false);

  const typeMeetingOptions = [
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
    if (files) {
      files?.forEach(async (e) => {
        await uploadFile({
          file: e,
          meetingId: "",
          // onSuccess: () => {
          //   refetchListDocument();
          // },
        });
      });
    }
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
    place: "",
    secretary: filterSecretary,
    type: "",
    checkBoxUploadFile: false,
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
                          <Tiny setContent={() => {}} initialValue="" />
                          <Box>
                            <Checkbox name="checkBoxUploadFile" defaultChecked color="success" />
                            Chọn tải file
                          </Box>
                          {values?.checkBoxUploadFile ? (
                            <UploadFile onFileSelected={handleChooseFile} />
                          ) : undefined}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12} sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, display: "grid", pb: 2 }}>
                        <Box sx={{ display: "flex" }}>
                          <LabelCommon label="Thời gian từ" />
                          <FastField
                            component={DateTimeField}
                            name="startTime"
                            required
                            sx={{ flex: 2, "& div": { borderRadius: "0.5rem" } }}
                            placeholder="Chọn thời gian bắt đầu"
                            disabled={isDetail}
                          />
                        </Box>
                        <Box sx={{ display: "flex" }}>
                          <LabelCommon label="Thời gian hết hạn" />
                          <FastField
                            component={DateTimeField}
                            name="endTime"
                            sx={{ flex: 2, "& div": { borderRadius: "0.5rem" } }}
                            required
                            placeholder="Chọn thời gian kết thúc"
                            disabled={isDetail}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={12} sx={{ display: "flex", pb: 2 }}>
                        <LabelCommon label="Địa điểm" />
                        <FastField sx={{ flex: 5 }} component={TextField} name={"place"} required placeholder="Nhập địa điểm họp" disabled={isDetail} />
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
                  {isDetail ? (
                    <Box />
                  ) : (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }} width="100%">
                      <Box
                        sx={{
                          color: "#E96B58",
                          border: "1px solid #E96B58",
                          padding: "10px 24px",
                          borderRadius: 3,
                          fontWeight: "600",
                          boxShadow: 1,
                          width: 130,
                          textAlign: "center",
                        }}
                        onClick={handleCancel}
                      >
                        Huỷ
                      </Box>
                      <Box
                        sx={{
                          border: "1px solid #E96B58",
                          padding: "10px 24px",
                          borderRadius: 3,
                          fontWeight: "600",
                          color: "white",
                          bgcolor: "#E96B58",
                          ml: 1,
                          boxShadow: 1,
                          width: 130,
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        onClick={() => handleSubmit()}
                      >
                        Tạo mới
                      </Box>
                      {/* <ButtonCommon
                        // startIcon={<Add />}
                        sx={{ alignSelf: "center", padding: "40px auto", color: "rgba(233, 107, 88, 0.5)", border: "1px solid rgba(233, 107, 88, 0.5)" }}
                        onClick={() => handleSubmit()}
                        variant="outlined"
                      >
                        Huỷ
                      </ButtonCommon>
                      <ButtonCommon
                        // startIcon={<Add />}
                        sx={{
                          alignSelf: "center",
                          color: "white",
                          padding: "40px auto",
                          bgcolor: "rgba(233, 107, 88, 0.5)",
                          border: "1px solid rgba(233, 107, 88, 0.5)",
                        }}
                        onClick={() => handleSubmit()}
                        // color="rgba(233, 107, 88, 0.5)"
                        variant="outlined"
                      >
                        Tạo mới
                      </ButtonCommon> */}
                    </Box>
                  )}
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

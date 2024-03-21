import { Add } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FastField, Field, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import AutoCompleteField from "../../../component/Autocomplete";
import ButtonCommon from "../../../component/Button";
import TextField from "../../../component/TextField";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListUser from "../../../hooks/useGetListUser";
import AuthServices from "../../../services/Auth.services";
import { error } from "console";

interface IProps {
  onAdd: (value: any) => void;
  data: any;
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
  const { onAdd, data: dataRow } = props;
  const { filters } = useFiltersHandler({ page: 0 });
  const { data } = useGetListUser(filters);
  const userInfo = AuthServices.getUserLocalStorage();

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

  const filterSecretary = dataRow
    ? dataRow?.members
        .filter((elm) => elm?.memberType === "SECRETARY")
        .map((e) => {
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
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box p={2} sx={{ textAlign: "center", fontSize: "25px" }}>
          Tạo mới cuộc họp
        </Box>
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
            console.log(values, errors, "123hihuhu______________");
            return (
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <FastField component={TextField} name={"name"} fullWidth label={"Tiêu đề"} required placeholder="Nhập tiêu đề cuộc họp" disabled={isDetail} />
                </Grid>
                <Grid item xs={6} md={12}>
                  <FastField
                    options={typeMeetingOptions}
                    component={AutoCompleteField}
                    name={"type"}
                    fullWidth
                    label={"Loại phiên họp"}
                    required
                    placeholder="Lựa chọn"
                    disabled={isDetail}
                  />
                </Grid>
                <Grid item xs={6} md={12}>
                  <FastField
                    component={TextField}
                    multiline
                    rows={2}
                    name={"description"}
                    fullWidth
                    label={"Nội dung"}
                    required
                    placeholder="Vui lòng nhập nội dung"
                    disabled={isDetail}
                  />
                </Grid>
                <Grid item xs={6} md={12}>
                  <FastField
                    component={TextField}
                    multiline
                    rows={2}
                    name={"agenda"}
                    fullWidth
                    label={"Chương trình họp"}
                    required
                    placeholder="Vui lòng nhập chương trình họp"
                    disabled={isDetail}
                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, display: "grid" }}>
                  <FastField
                    component={DateTimeField}
                    name="startTime"
                    label={"Thời gian từ"}
                    required
                    placeholder="Vui lòng chọn thời gian"
                    disabled={isDetail}
                  />
                  <FastField
                    component={DateTimeField}
                    name="endTime"
                    label={"Thời gian hết hạn"}
                    required
                    placeholder="Vui lòng chọn thời gian"
                    disabled={isDetail}
                  />
                  {/* <DateTimeField required label="Thời gian từ" name="startTime" />
                  <DateTimeField required label="Thời gian hết hạn" name="endTime" /> */}
                </Grid>
                <Grid item xs={6} md={12}>
                  <FastField component={TextField} name={"place"} fullWidth label={"Địa điểm"} required placeholder="Nhập địa điểm họp" disabled={isDetail} />
                </Grid>

                {/* <Grid item xs={6} md={12}>
                <Tiny setContent={() => {}} initialValue="" />
              </Grid> */}
                {/* <Grid item xs={6} md={12}>
                <Box>
                  <Switch checked={Boolean(values.status)} onChange={() => setFieldValue("status", !Boolean(values.status))} />
                  {Boolean(values.status) ? "Kích hoạt" : "Không kích hoạt"}
                </Box>
              </Grid> */}
                <Grid item xs={6} md={12}>
                  <Field
                    component={AutoCompleteField}
                    name="assigned"
                    multiple
                    fullWidth
                    required
                    onChangeCustomize={(e: any, value: any) => {
                      setFieldValue("assigned", value);
                    }}
                    options={listOptions}
                    label={"Thành viên"}
                    disabled={isDetail}
                  />
                </Grid>

                <Grid item xs={6} md={12}>
                  <Field
                    component={AutoCompleteField}
                    name="secretary"
                    fullWidth
                    required
                    onChangeCustomize={(e: any, value: any) => {
                      setFieldValue("secretary", value);
                    }}
                    options={listOptions}
                    label={"Thư ký"}
                    disabled={isDetail}
                  />
                </Grid>
                {isDetail ? (
                  <Box />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", m: 3 }} width="100%">
                    <ButtonCommon
                      startIcon={<Add />}
                      sx={{ alignSelf: "center", padding: "40px auto" }}
                      onClick={() => handleSubmit()}
                      color="success"
                      variant="contained"
                    >
                      Tạo mới
                    </ButtonCommon>
                  </Box>
                )}
              </Grid>
            );
          }}
        </Formik>
      </LocalizationProvider>
    </Box>
  );
};

export default AddMeeting;

import { Box, Grid, Switch, Typography } from "@mui/material";
import { FastField, Formik, Field } from "formik";
import React from "react";
import TextField from "../../../component/TextField";
import * as Yup from "yup";
import cacheKeys from "../../../const/cachedKeys";
import { useGet } from "../../../store/useStores";
import AutoCompleteField from "../../../component/Autocomplete";
import useGetListUser from "../../../hooks/useGetListUser";
import useFiltersHandler from "../../../hooks/useFilters";
import AuthServices from "../../../services/Auth.services";

interface IProps {
  onAdd: (value: any) => void;
}

const validationSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Đây là trường bắt buộc"),
    description: Yup.string().required("Đây là trường bắt buộc"),
    assigned: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
  });
};

const AddMeeting = (props: IProps) => {
  const { onAdd } = props;
  const { filters } = useFiltersHandler({ page: 0 });
  const { data } = useGetListUser(filters);
  const userInfo = AuthServices.getUserLocalStorage();
  
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

  const initial = {
    name: "",
    status: 1,
    description: "",
    assigned: [
      {
          value: userInfo?.id,
          label: userInfo?.fullname,
      }
    ],
  }

  return (
    <Box>
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
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                <FastField component={TextField} name={"name"} fullWidth label={"Tên phiên họp"} required variant="standard" />
              </Grid>
              <Grid item xs={6} md={12}>
                <FastField
                  component={TextField}
                  multiline
                  rows={2}
                  name={"description"}
                  fullWidth
                  label={"Mô tả phiên họp"}
                  required
                  variant="standard"
                />
              </Grid>
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
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    onClick={() => handleSubmit()}
                    p={1}
                    sx={{ backgroundColor: "#2f8a46", color: "white", borderRadius: "10px", fontWeight: "bold" }}
                  >
                    Tạo mới
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AddMeeting;

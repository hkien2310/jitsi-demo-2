import { Box, Button, Grid } from "@mui/material";
import { green, indigo } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FastField, Field, Form, Formik } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import AutoCompleteField from "../../../component/Autocomplete";
import SelectField from "../../../component/Select";
import TextField from "../../../component/TextField";
import UploadFile from "../../../component/UploadFile";
import CheckBoxField from "../../../component/checkBox";
import DateTimePickerField from "../../../component/dateTime";
import LabelCommon from "../../../component/label";
import Tiny from "../../../component/tinyMce";
import { showError, showSuccess } from "../../../helper/toast";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListUser from "../../../hooks/useGetListUser";
import AuthServices from "../../../services/Auth.services";
import MeetingServices from "../../../services/Meeting.services";
import ButtonCommon from "../../../component/Button";
import dayjs from "dayjs";
export const typeMeetingOptions = [
  {
    label: "Họp giao ban",
    value: "1",
  },
  {
    label: "Phiên họp thường trực",
    value: "2",
  },
  {
    label: "Thảo luận tổ",
    value: "3",
  },
  {
    label: "Họp thẩm tra",
    value: "4",
  },
  {
    label: "Họp thường kỳ tháng",
    value: "5",
  },
  {
    label: "Họp phiên chính thức",
    value: "6",
  },
  {
    label: "Họp phiên trù bị",
    value: "7",
  },
  {
    label: "Họp nội dung khác",
    value: "8",
  },
];
interface IProps {
  refetchList: () => void;
  onAdd: (value: any) => void;
  data: any;
  onClose: () => void;
}

const validationSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Đây là trường bắt buộc"),
    description: Yup.string().required("Đây là trường bắt buộc"),
    assigned: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
    agenda: Yup.string().required("Đây là trường bắt buộc"),
    startTime: Yup.string().required("Đây là trường bắt buộc"),
    endTime: Yup.string().required("Đây là trường bắt buộc"),
    location: Yup.string().required("Đây là trường bắt buộc"),
    secretary: Yup.object().required("Đây là trường bắt buộc"),
    type: Yup.string().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
  });
};

const AddMeeting = (props: IProps) => {
  const { refetchList, onAdd, data: dataRow, onClose } = props;
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
      .filter((elm: any) => elm?.memberType !== "SECRETARY")
      .map((e: any) => {
        return {
          label: e?.user?.fullname,
          value: e?.user?.id,
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
          value: e?.user?.id,
        };
      })?.[0]
    : "";

  const file = {
    name: dataRow?.syllabusFileName,
    size: dataRow?.syllabusFileSize,
  };
  const initial: any = {
    name: dataRow?.title,
    status: 1,
    description: dataRow?.description,
    assigned: filterMember,
    agenda: dataRow?.syllabusContent || "",
    startTime: dataRow?.startTime,
    endTime: dataRow?.endTime,
    location: dataRow?.location,
    secretary: filterSecretary,
    type: dataRow?.type || "",
    acceptUploadFile: Boolean(dataRow?.syllabusFileName) || false,
    uploadFile: dataRow ? file : null,
  };
  // console.log(dataRow, 'dataRow')
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Formik
          initialValues={initial}
          validationSchema={validationSchema}
          onSubmit={async (values, help) => {
            help.setSubmitting(true)
            onAdd(values);
            help?.resetForm();
            const secretary = [
              {
                userId: values?.secretary.value,
                memberType: "SECRETARY",
              },
            ];
            const assigned = values?.assigned.map((elm: any) => ({
              userId: elm?.value,
              memberType: "MEMBER",
            }));

            const typeMeeting = typeMeetingOptions?.find((elm: any) => `${elm?.value}` === `${values?.type}`);

            const members = secretary.concat(assigned);
            const formData = new FormData();
            formData.append("title", values?.name);
            members?.forEach((e, index) => {
              formData.append("members", JSON.stringify(e));
              // formData.append("members[" + index + "].memberType", e.memberType);
            });
            formData.append("description", values?.description);
            formData.append("type", typeMeeting?.value || "");
            formData.append("syllabusContent", values?.agenda || "");
            formData.append("startTime", values?.startTime?.toISOString());
            formData.append("endTime", values?.endTime?.toISOString());
            formData.append("location", values?.location);
            formData.append("syllabusFile", values?.uploadFile || "");
            try {
              const response = await MeetingServices.createMeeting(formData);
              if (response?.status === 201 && response?.data) {
                refetchList();
                showSuccess(response?.statusText);
                help.setSubmitting(false)
              }
            } catch (error: any) {
              help.setSubmitting(false)
              showError(error);
            }
          }}
          innerRef={ref}
          enableReinitialize
        >
          {({ values, setFieldValue, handleSubmit, errors, isValid, isSubmitting }) => {
            // console.log("error__", values);

            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Tiêu đề" />
                    <FastField component={TextField} name="name" fullWidth required placeholder="Nhập tiêu đề cuộc họp" disabled={isDetail} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Loại phiên họp" />
                    <FastField options={typeMeetingOptions} component={SelectField} name="type" required disabled={isDetail} />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <LabelCommon label="Nội dung" />
                    <FastField
                      component={TextField}
                      name="description"
                      fullWidth
                      multiline
                      rows={3}
                      required
                      placeholder="Vui lòng nhập nội dung"
                      disabled={isDetail}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
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
                      {values?.acceptUploadFile ? (
                        <UploadFile
                          hideUpload={Boolean(dataRow)}
                          onFileSelected={handleChooseFile}
                          files={values.uploadFile ? [values.uploadFile] : []}
                          multiple={false}
                        />
                      ) : undefined}
                    </Box>

                  </Grid>
                  {/* <Grid item xs={12} md={12} sx={{ gridTemplateColumns: "1fr 1fr", gap: 2, display: "grid", pb: 2 }}> */}
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Thời gian từ" />
                    <Field
                      minDate={dayjs()}
                      component={DateTimePickerField}
                      name="startTime"
                      required
                      sx={{ "& div": { borderRadius: "0.5rem" }, width: "100%" }}
                      placeholder="Chọn thời gian bắt đầu"
                      disabled={isDetail}
                      // formatCustom={'YYYY-MM-DD HH:mm:ss'}
                      isDayjs
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Thời gian hết hạn" />
                    <Field
                      component={DateTimePickerField}
                      isDayjs
                      minDate={dayjs(values.startTime)}
                      name="endTime"
                      sx={{ "& div": { borderRadius: "0.5rem" }, width: "100%" }}
                      required
                      placeholder="Chọn thời gian kết thúc"
                      disabled={isDetail}
                    // formatCustom={'YYYY-MM-DD HH:mm:ss'}
                    />
                  </Grid>
                  {/* </Grid> */}
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Địa điểm" />
                    <FastField
                      multiline
                      rows={3}
                      fullWidth
                      component={TextField}
                      name={"location"}
                      required
                      placeholder="Nhập địa điểm họp"
                      disabled={isDetail}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Thành viên" />
                    <Grid>
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
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabelCommon label="Thư ký" />
                    <Grid>
                      <Field
                        component={AutoCompleteField}
                        name="secretary"
                        fullWidth
                        required
                        onChangeCustomize={(e: any, value: any) => {
                          setFieldValue("secretary", value);
                        }}
                        options={listOptions?.filter((e) => `${e?.value}` !== `${userInfo?.id}`)}
                        disabled={isDetail}
                      />
                    </Grid>
                  </Grid>
                  {!isDetail ? (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }} width="100%">
                      <ButtonCommon variant="outlined" onClick={onClose} sx={{ fontWeight: "600" }}>
                        Huỷ
                      </ButtonCommon>
                      <ButtonCommon
                        disabled={isSubmitting}
                        variant="contained"
                        // type="submit"
                        onClick={() => handleSubmit()}
                        sx={{ fontWeight: "600", ml: 1 }}
                      >
                        Tạo mới
                      </ButtonCommon>
                    </Box>
                  ) : (
                    <Box />
                  )}
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </LocalizationProvider>
    </Box>
  );
};

export default AddMeeting;

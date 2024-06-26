import { Box } from "@mui/material";
import { FastField, Formik } from "formik";
import ButtonCommon from "../../../component/Button";
import TextField from "../../../component/TextField";
import LabelCommon from "../../../component/label";
import * as Yup from "yup";
import UserServices from "../../../services/User.services";
import { regexUsername } from "../../../helper/function";
import { useGetDetailUser } from "../../../hooks/useGetDetailUser";
import { useEffect } from "react";
import { showError, showSuccess } from "../../../helper/toast";

interface IAddAccount {
  refetchList: () => void;
  onClose: () => void;
  id: number;
}
const AddAccount = (props: IAddAccount) => {
  const { refetchList, onClose, id } = props;
  const { data: userDetail, isLoading, refetch } = useGetDetailUser(id);
  const isDetail = Boolean(userDetail);

  // !Init
  const initial: any = {
    account: userDetail?.username || "",
    password: userDetail?.password || "",
    fullName: userDetail?.fullname || "",
    email: userDetail?.email || "",
  };
  const validationSchema = () => {
    return Yup.object().shape({
      account: Yup.string()
        .required("Đây là trường bắt buộc")
        .test("is-tea", "Tài khoản không chứa khoảng cách và ký tự đặc biệt!", (value: any) => regexUsername(value)),
      password: Yup.string().required("Đây là trường bắt buộc"),
      fullName: Yup.string().required("Đây là trường bắt buộc"),
      email: Yup.string().required("Đây là trường bắt buộc").email("Không đúng định dạng email!"),
    });
  };
  // !Function

  // !Render
  return (
    <Box>
      <Formik
        initialValues={initial}
        validationSchema={isDetail ? null : validationSchema}
        onSubmit={async (values, help) => {
          const body = {
            fullname: values.fullName,
            username: values.account,
            password: values.password,
            email: values.email,
          };
          try {
            const response = await UserServices.postUser(body);
            if (response?.status === 201 && response?.data) {
              refetchList();
              onClose();
              showSuccess(response?.statusText)
            }
          } catch (error: any) {
            showError(error);
          }
        }}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, errors }) => {
          return (
            <>
              <Box>
                <Box>
                  <LabelCommon label="Tài khoản" />
                  <FastField component={TextField} name="account" fullWidth required placeholder="Nhập tên tài khoản" disabled={isDetail} sx={{ mb: "16px" }} />
                </Box>
                <Box>
                  <LabelCommon label="Mật khẩu" />
                  <FastField component={TextField} name="password" fullWidth required placeholder="Nhập mật khẩu" disabled={isDetail} sx={{ mb: "16px" }} />
                </Box>
                <Box>
                  <LabelCommon label="Họ và tên" />
                  <FastField component={TextField} name="fullName" fullWidth required placeholder="Họ và tên" disabled={isDetail} sx={{ mb: "16px" }} />
                </Box>
                <Box>
                  <LabelCommon label="Email" />
                  <FastField component={TextField} name="email" fullWidth required placeholder="Nhập email" disabled={isDetail} sx={{ mb: "16px" }} />
                </Box>
              </Box>
              {!isDetail ? (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }} width="100%">
                  <ButtonCommon
                    sx={{
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
                      padding: "14px 24px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      ml: 1,
                    }}
                    variant="contained"
                    disabled={!errors}
                    onClick={() => handleSubmit()}
                  >
                    Tạo mới
                  </ButtonCommon>
                </Box>
              ) : (
                <Box />
              )}
            </>
          );
        }}
      </Formik>
    </Box>
  );
};
export default AddAccount;

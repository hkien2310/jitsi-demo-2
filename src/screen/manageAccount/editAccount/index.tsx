import { Box } from "@mui/material";
import { FastField, Formik } from "formik";
import * as Yup from "yup";
import ButtonCommon from "../../../component/Button";
import TextField from "../../../component/TextField";
import LabelCommon from "../../../component/label";
import { regexUsername } from "../../../helper/function";
import { showError, showSuccess } from "../../../helper/toast";
import { useGetDetailUser } from "../../../hooks/useGetDetailUser";
import UserServices from "../../../services/User.services";

interface IEditAccount {
  refetchList: () => void;
  onClose: () => void;
  id: number;
}
const EditAccount = (props: IEditAccount) => {
  const { refetchList, onClose, id } = props;
  const { data: userDetail, isLoading, refetch } = useGetDetailUser(id);
  
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
        validationSchema={validationSchema}
        onSubmit={async (values, help) => {
          const body = {
            fullname: values.fullName,
            username: values.account,
            password: values.password,
            email: values.email,
          };
          try {
            const response = await UserServices.updateUser(id, body);
            if (response?.data) {
              refetchList();
              onClose();
              showSuccess('Chỉnh sửa thành công!')
            }
          } catch (error: any) {
            showError(error);
          }
        }}
        enableReinitialize
      >
        {({ handleSubmit, errors }) => {
          return (
            <>
              <Box>
                <Box>
                  <LabelCommon label="Tài khoản" />
                  <FastField component={TextField} name="account" fullWidth required placeholder="Nhập tên tài khoản" sx={{ mb: "16px" }} />
                </Box>

                <Box>
                  <LabelCommon label="Mật khẩu" />
                  <FastField component={TextField} name="password" fullWidth required placeholder="Nhập mật khẩu" sx={{ mb: "16px" }} />
                </Box>

                <Box>
                  <LabelCommon label="Họ và tên" />
                  <FastField component={TextField} name="fullName" fullWidth required placeholder="Họ và tên" sx={{ mb: "16px" }} />
                </Box>
                <Box>
                  <LabelCommon label="Email" />
                  <FastField component={TextField} name="email" fullWidth required placeholder="Nhập email" sx={{ mb: "16px" }} />
                </Box>
              </Box>
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
                  Chỉnh sửa
                </ButtonCommon>
              </Box>
            </>
          );
        }}
      </Formik>
    </Box>
  );
};
export default EditAccount;

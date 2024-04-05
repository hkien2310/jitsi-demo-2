import { Box, Grid } from "@mui/material";
import { FastField, Formik } from "formik";
import { ImageSource } from "../../../assets/Image";
import ButtonCommon from "../../../component/Button";
import TextField from "../../../component/TextField";
import LabelCommon from "../../../component/label";
import cacheKeys from "../../../const/cachedKeys";
import { showError, showSuccess } from "../../../helper/toast";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListPermission from "../../../hooks/useGetListPermission";
import { IBodyPostCreateUserGroup } from "../../../interface/usergroup";
import UserGroupService from "../../../services/UserGroup.service";
import { useSave } from "../../../store/useStores";

interface IProps {
  onClose: () => void
  onSuccess: () => void
}

const AddRole = (props: IProps) => {
  const { onClose, onSuccess } = props
  const save = useSave()
  // !Init
  const initial: any = {
    nameGroup: "",
    permission: [],
  };
  const { filters: filterPermission } = useFiltersHandler({
    page: 0,
    perPage: 100,
  })
  const { data: dataPermission, refetch: refetchPermission } = useGetListPermission(filterPermission)

  // !Function
  // const onClose = () => { };

  const onCreateUserGroup = async (values: any) => {
    const valueCVT: IBodyPostCreateUserGroup = {
      name: values.nameGroup,
      permissionIds: values.permission.map((e: any) => e?.id)
    }
    try {
      save(cacheKeys.LOADING_APP, true)
      const response = await UserGroupService.postCreateUserGroup(valueCVT)
      if (response.status === 201) {
        showSuccess("Tạo mới thành công")
        onClose?.()
        onSuccess?.()
      }
    } catch (e: any) {
      showError("Đã có lỗi xảy ra!")
      // showError(e?.response?.data?.message)
    } finally {
      save(cacheKeys.LOADING_APP, false)
    }
  }

  // !Render
  return (
    <Box>
      <Formik initialValues={initial} onSubmit={(values) => { onCreateUserGroup(values) }}>
        {({ values, setFieldValue, handleSubmit, errors }) => {
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
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
                          onClick={() => {
                            dataPermission?.data?.every((el: any) => {
                              return values.permission.some((e: any) => e?.id === el?.id)
                            })
                              ?
                              setFieldValue('permission', [])
                              :
                              setFieldValue('permission', dataPermission?.data || [])
                          }}
                        >
                          <Box pr={1}>
                            {
                              dataPermission?.data?.every((el: any) => {
                                return values.permission.some((e: any) => e?.id === el?.id)
                              }) ?
                                <img alt='' src={ImageSource.tickSquare} style={{ height: "14px", width: "14px" }} />
                                :
                                <img alt='' src={ImageSource.box} style={{ height: "14px", width: "14px" }} />
                            }
                          </Box>
                        </Box>
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
                        // type="submit"
                        size="small"
                        onClick={() => refetchPermission({ ...filterPermission, textSearch: values.search })}
                        sx={{ p: 0, minWidth: "auto", height: "36px", width: "40px", borderRadius: "8px" }}
                      >
                        <img src={ImageSource.searchIcon} style={{ width: "20px", height: "20px" }} alt={""} />
                      </ButtonCommon>
                    </Box>
                    <Box sx={{ pl: "10px", pt: "10px", pb: "8px", pr: "10px" }}>
                      {(dataPermission?.data && dataPermission?.data?.length > 0) ? dataPermission?.data?.map((elm, index) => {
                        return (
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
                            onClick={() => {
                              values.permission?.some((el: any) => el?.id === elm?.id) ?
                                setFieldValue('permission', values.permission?.filter((el: any) => el?.id !== elm?.id)) :
                                setFieldValue('permission', [...values.permission, elm])
                            }}
                            mb={2}
                          >
                            <Box pr={1}>
                              {
                                values.permission?.some((el: any) => el?.id === elm?.id) ?
                                  <img alt='' src={ImageSource.tickSquare} style={{ height: "14px", width: "14px" }} />
                                  :
                                  <img alt='' src={ImageSource.box} style={{ height: "14px", width: "14px" }} />
                              }
                            </Box>
                            <Box>
                              {elm?.name}
                            </Box>
                          </Box>
                        );
                      }) : <Box sx={{textAlign: 'center'}} p={1}>
                          Không có dữ liệu
                        </Box>
                    }
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6} sx={{ display: "flex" }}>
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{}}>Các quyền đã được gán</Box>
                    <Box sx={{ boxShadow: "-10px 10px 0px 0px #E6EAEE", border: "1px solid #E7E7E7", borderRadius: "10px" }}>
                      {values.permission.length === 0 ?
                        <Box sx={{ textAlign: 'center' }} py={3}>
                          Chưa có quyền được chọn
                        </Box>
                        : values.permission.map((elm: any) => {
                          return (
                            <Box key={elm?.id} sx={{ borderBottom: "1px solid #E7E7E7", pt: "12px", pb: "12px", pl: "40px" }}>
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
                  disabled={!Boolean(values.nameGroup) || !Boolean(values.permission.length)}
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

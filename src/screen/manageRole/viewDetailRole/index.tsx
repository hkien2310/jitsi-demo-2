import { Box, Grid } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import LabelCommon from "../../../component/label";
import TextField from "../../../component/TextField";
import CheckBoxField from "../../../component/checkBox";
import { green, indigo } from "@mui/material/colors";
import ButtonCommon from "../../../component/Button";
import { ImageSource } from "../../../assets/Image";
import useFiltersHandler from "../../../hooks/useFilters";
import useGetListPermission from "../../../hooks/useGetListPermission";
import UserGroupService from "../../../services/UserGroup.service";
import { IBodyPostCreateUserGroup, IUserGroupItem } from "../../../interface/usergroup";
import { showError, showSuccess } from "../../../helper/toast";
import { useGet, useSave } from "../../../store/useStores";
import cacheKeys from "../../../const/cachedKeys";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeviceType } from "../../../hooks/useDivices";

interface IProps {
  onClose: () => void
  idRole: string | number
  isEdit: boolean
  onSuccess: () => void
}

const ViewDetailRole = (props: IProps) => {
  const { onClose, idRole, isEdit, onSuccess } = props
  const save = useSave()
  const trigger = useRef(false)
  const deviceType = useGet(cacheKeys.DEVICE_TYPE)
  const isMobile = useMemo(() => {
    return deviceType === DeviceType
  }, [deviceType])
  // !Init
  const initial: any = useMemo(() => (
    {
      nameGroup: "",
      permission: [],
    }
  ), [])
  const { filters: filterPermission } = useFiltersHandler({
    page: 0,
    perPage: 100,
  })
  const [dataDetail, setDataDetail] = useState<IUserGroupItem>()
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
      const response = await UserGroupService.patchChangeUserGroup(valueCVT, idRole)
      if (response.status === 200) {
        showSuccess("Chỉnh sửa thành công")
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

  const getDetailDataUserGroup = useCallback(async () => {
    try {
      trigger.current = true
      save(cacheKeys.LOADING_APP, true)
      const response = await UserGroupService.getDetailUserGroup(idRole)
      const data = response.data as IUserGroupItem
      setDataDetail(data)
    } catch (e) {
      showError("Có lỗi xảy ra trong quá trình lấy dữ liệu!")
    } finally {
      save(cacheKeys.LOADING_APP, false)
      trigger.current = false
    }
  }, [idRole, save])

  useEffect(() => {
    if (!trigger.current) {
      if (idRole !== undefined) {
        getDetailDataUserGroup()
      }
    }
  }, [getDetailDataUserGroup, idRole])

  const compareInit = useMemo(() => {
    if (dataDetail) {
      return {
        nameGroup: dataDetail.name,
        permission: dataDetail.permissions?.map((e) => ({
          ...e?.permission
        })),
      }
    }
    return initial
  }, [dataDetail, initial])

  // !Render
  return (
    <Box>
      <Formik initialValues={compareInit} enableReinitialize onSubmit={(values) => { onCreateUserGroup(values) }}>
        {({ values, setFieldValue, handleSubmit, errors }) => {
          const checkAll = dataPermission?.data?.every((el: any) => {
            return values?.permission?.some((e: any) => e?.id === el?.id)
          })
          console.log(isEdit, 'isEditisEditisEdit')
          return (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <LabelCommon label="Tên nhóm" />
                  <FastField
                    component={TextField}
                    name="nameGroup"
                    fullWidth
                    required
                    placeholder="Nhập tên nhóm quyền"
                    disabled={!isEdit}
                    sx={{ mb: "24px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={ isMobile ? 2 : 8}>
                    <Grid item xs={12} md={6}>
                      <LabelCommon label="Quyền có thể sử dụng" />
                      <Box sx={{ borderRadius: "10px", border: "1px solid #E7E7E7" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderBottom: "1px solid #E7E7E7" }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%", mr: "8px" }}>
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
                              onClick={() => {
                                if (isEdit) {
                                  if (checkAll) {
                                    setFieldValue('permission', [])
                                  } else {
                                    setFieldValue('permission', dataPermission?.data || [])
                                  }
                                }
                              }}
                            >
                              <Box pr={1}>
                                {
                                  checkAll ?
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
                              disabled={!isEdit}
                            />
                          </Box>
                          <ButtonCommon
                            variant="contained"
                            color="secondary"
                            // type="submit"
                            size="small"
                            disabled={!isEdit}
                            onClick={() => {
                              if (isEdit) {
                                refetchPermission({ ...filterPermission, textSearch: values.search })
                              }
                            }}
                            sx={{ p: 0, minWidth: "auto", height: "36px", width: "40px", borderRadius: "8px" }}
                          >
                            <img src={ImageSource.searchIcon} style={{ width: "20px", height: "20px" }} alt={""} />
                          </ButtonCommon>
                        </Box>
                        <Box sx={{ pl: "10px", pt: "10px", pb: "8px", pr: "10px" }}>
                          {dataPermission?.data?.map((elm, index) => {
                            const checkItem = values.permission?.some((el: any) => el?.id === elm?.id)
                            return (
                              <Box
                                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
                                onClick={() => {
                                  if (isEdit) {
                                    if (checkItem) {
                                      setFieldValue('permission', values.permission?.filter((el: any) => el?.id !== elm?.id))
                                    } else {
                                      setFieldValue('permission', [...values.permission, elm])
                                    }
                                  }
                                }}
                                mb={2}
                              >
                                <Box pr={1}>
                                  {
                                    checkItem ?
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
                          })}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{marginBottom: '6px'}}>Các quyền đã được gán</Box>
                        <Box sx={{ boxShadow: "-10px 10px 0px 0px #E6EAEE", border: "1px solid #E7E7E7", borderRadius: "10px" }}>
                          {values.permission.length === 0 ?
                            <Box sx={{ textAlign: 'center' }} py={3}>
                              Chưa có quyền được chọn
                            </Box>
                            : values.permission.map((elm: any) => {
                              return (
                                <Box key={elm.id} sx={{ borderBottom: "1px solid #E7E7E7", pt: "12px", pb: "12px", pl: "40px" }}>
                                  {elm.name}
                                </Box>
                              );
                            })}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                {
                  isEdit ?
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
                        Chỉnh sửa
                      </ButtonCommon>
                    </Box>
                    : <></>
                }
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
export default ViewDetailRole;

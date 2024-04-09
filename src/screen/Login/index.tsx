import { Box, Checkbox, Grid, Typography } from "@mui/material"
import { FastField, Formik } from "formik"
import TextField from "../../component/TextField"
import { FormLabel } from '@mui/material';
import AuthServices from "../../services/Auth.services";
import cacheKeys from "../../const/cachedKeys";
import { useGet, useSave } from "../../store/useStores";
import { ImageSource } from "../../assets/Image";
import * as Yup from "yup";
import ButtonCommon from "../../component/Button";
import { DeviceType } from "../../hooks/useDivices";
import { useMemo } from "react";
import { showError, showSuccess } from "../../helper/toast";

const validationSchema = () => {
    return Yup.object().shape({
        username: Yup.string().required("Đây là trường bắt buộc"),
        password: Yup.string().required("Đây là trường bắt buộc"),
    });
};


const LoginScreen = () => {
    const save = useSave()
    const deviceType = useGet(cacheKeys.DEVICE_TYPE)
    const isMobile = useMemo(() => {
        return deviceType === DeviceType.MOBILE
    }, [deviceType])
    const handleLogin = async (values: any) => {
        try {
            await AuthServices.login({
                username: values?.username,
                password: values?.password
            }).then(async (data) => {
                if (data?.data?.accessToken) {
                    await AuthServices.saveToken(data?.data?.accessToken)
                    await AuthServices.saveUserToLocalStorage(data?.data?.user)
                    save(cacheKeys.IS_LOGGED, true)
                    showSuccess('Đăng nhập thành công!')
                }
            })
        } catch (e: any) {
            const message = e?.response?.data?.message || 'Đã có lỗi!'
            showError(message)
        }
    }

    return <Box>
        <Formik
            initialValues={{
                username: '',
                password: '',
                check: false
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleLogin(values)}
        >
            {({ values, handleSubmit, setFieldValue }) => {
                return <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#13167d', flexDirection: 'column' }}>
                    <Box sx={{ width: '75vw', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '8px' }}>
                        <Grid container>
                            {!isMobile &&
                                <Grid item xs={12} md={8}>
                                    <img src={ImageSource.loginAvatar} alt='' style={{ width: '100%', height: '60vh', objectFit: 'cover', borderRadius: '8px', }} />
                                </Grid>
                            }
                            <Grid item xs={12} md={4} p={1}>
                                <Box sx={{ display: 'flex', height: '100%' }}>
                                    <Box>
                                        <Box pb={2} pt={5}>
                                            <img src={ImageSource.logoWeb} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '40px' }} />
                                        </Box>
                                        <Box p={1}>
                                            {/* <Box id="username" sx={{ textAlign: 'left' }}>Tên đăng nhập</Box> */}
                                            <FastField
                                                id={"username"}
                                                component={TextField}
                                                name={"username"}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                placeholder="Tên đăng nhập"
                                                label="Tên đăng nhập"
                                                fullWidth
                                            />
                                        </Box>
                                        <Box p={1}>
                                            {/* <Box id="password" sx={{ textAlign: 'left' }}>Mật khẩu</Box> */}
                                            <FastField
                                                component={TextField}
                                                id={"password"}
                                                name={"password"}
                                                type={'password'}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                placeholder="Mật khẩu"
                                                label="Mật khẩu"
                                                fullWidth
                                            />
                                        </Box>
                                        {/* <Box p={1} sx={{ textAlign: 'left', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                            <Checkbox checked={values.check} onChange={() => setFieldValue('check', !values.check)} />
                                            <Typography>
                                                Ghi nhớ đăng nhập
                                            </Typography>
                                        </Box> */}
                                        <Box px={1} mt={2}>
                                            <ButtonCommon
                                                fullWidth
                                                variant="contained"
                                                onClick={() => handleSubmit()}
                                                sx={{
                                                    padding: '16px',
                                                    // margin: '16px', 
                                                    backgroundColor: '#2f8a46',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                                Đăng nhập
                                            </ButtonCommon>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Typography py={2} sx={{ fontSize: '14px', color: 'grey', textAlign: 'center', width: '100%', }}>
                            @2024 Created
                        </Typography>

                    </Box>
                </Box>
            }}
        </Formik>
    </Box>
}

export default LoginScreen
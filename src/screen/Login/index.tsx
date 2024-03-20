import { Box, Checkbox, Grid, Typography } from "@mui/material"
import { FastField, Formik } from "formik"
import TextField from "../../component/TextField"
import { FormLabel } from '@mui/material';
import AuthServices from "../../services/Auth.services";
import cacheKeys from "../../const/cachedKeys";
import { useSave } from "../../store/useStores";
import { ImageSource } from "../../assets/Image";
import * as Yup from "yup";

const validationSchema = () => {
    return Yup.object().shape({
        username: Yup.string().required("Đây là trường bắt buộc"),
        password: Yup.string().required("Đây là trường bắt buộc"),
    });
};


const LoginScreen = () => {
    const save = useSave()
    const handleLogin = async (values: any) => {
        await AuthServices.login({
            username: values?.username,
            password: values?.password
        }).then(async (data) => {
            if (data?.data?.accessToken) {
                await AuthServices.saveToken(data?.data?.accessToken)
                await AuthServices.saveUserToLocalStorage(data?.data?.user)
                save(cacheKeys.IS_LOGGED, true)
            }
        })
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
                    <Box sx={{ width: '75%', backgroundColor: 'white' }}>
                        <Grid container >
                            <Grid item xs={8}>
                                <img src={ImageSource.loginAvatar} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Grid>
                            <Grid item xs={4} p={1}>
                                <Box sx={{ display: 'flex', height: '100%' }}>
                                    <Box>
                                        <Box pb={2} pt={5}>
                                            <img src={ImageSource.logoWeb} alt='' style={{ width: '25%', height: '25%', objectFit: 'cover' }} />
                                        </Box>
                                        <Box pb={2}>
                                            <img src={ImageSource.companyName} alt='' style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
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
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                placeholder="Mật khẩu"
                                                label="Mật khẩu"
                                                fullWidth
                                            />
                                        </Box>
                                        <Box p={1} sx={{ textAlign: 'left', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                            <Checkbox checked={values.check} onChange={() => setFieldValue('check', !values.check)} />
                                            <Typography>
                                                Ghi nhớ đăng nhập
                                            </Typography>
                                        </Box>
                                        <Box onClick={() => handleSubmit()} p={2} m={2} sx={{ backgroundColor: '#2f8a46', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}>
                                            Đăng nhập
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Typography py={2} sx={{ fontSize: '14px', color: 'grey', textAlign: 'center', width: '100%',  }}>
                            @2024 Created
                        </Typography>

                    </Box>
                </Box>
            }}
        </Formik>
    </Box>
}

export default LoginScreen
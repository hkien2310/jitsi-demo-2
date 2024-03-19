import { Box } from "@mui/material"
import { FastField, Formik } from "formik"
import TextField from "../../component/TextField"
import { FormLabel } from '@mui/material';
import AuthServices from "../../services/Auth.services";
import cacheKeys from "../../const/cachedKeys";
import { useSave } from "../../store/useStores";

const LoginScreen = () => {
    const save = useSave()
    const handleLogin = async (values: any) => {
        await AuthServices.login({
            username: values?.username,
            password: values?.password
        }).then(async (data) => { 
            if(data?.data?.accessToken) {
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
                password: ''
            }}
            onSubmit={(values) => handleLogin(values)}
        >
            {({ handleSubmit }) => {
                return <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ minWidth: '50%' }}>
                        <Box p={2}>
                            <Box id="username" sx={{ textAlign: 'left' }}>Tên đăng nhập</Box>
                            <FastField
                                id={"username"}
                                component={TextField}
                                name={"username"}
                                required
                                // placeholder="Tên đăng nhập"
                                fullWidth
                            />
                        </Box>
                        <Box p={2}>
                            <Box id="password" sx={{ textAlign: 'left' }}>Mật khẩu</Box>
                            <FastField
                                component={TextField}
                                id={"password"}
                                name={"password"}
                                required
                                // placeholder="Mật khẩu"
                                fullWidth
                            />
                        </Box>
                        <Box onClick={() => handleSubmit()} p={2} m={2} sx={{ backgroundColor: '#2f8a46', color: 'white', fontWeight: 'bold', borderRadius: '10px' }}>
                            Đăng nhập
                        </Box>
                    </Box>
                </Box>
            }}
        </Formik>
    </Box>
}

export default LoginScreen
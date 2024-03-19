import { Box, Grid, Switch, Typography } from '@mui/material'
import { FastField, Formik } from 'formik'
import React from 'react'
import TextField from '../../../component/TextField'
import * as Yup from "yup";
import cacheKeys from '../../../const/cachedKeys';
import { useGet } from '../../../store/useStores';
import AutoCompleteField from '../../../component/Autocomplete';

interface IProps {
    onAdd: (value: any) => void
}

const validationSchema = () => {
    return Yup.object().shape({
        name: Yup.string().required("Đây là trường bắt buộc"),
        description: Yup.string().required("Đây là trường bắt buộc"),
        assigned: Yup.array().required("Đây là trường bắt buộc").min(1, "Đây là trường bắt buộc"),
    });
}

const AddMeeting = (props: IProps) => {
    const { onAdd } = props
    const listUser = useGet(cacheKeys.DEMO_LIST_USER)
    return <Box>
        <Box p={2} sx={{ textAlign: 'center', fontSize: '25px' }}>
            Tạo mới cuộc họp
        </Box>
        <Formik
            initialValues={{
                name: '',
                status: 1,
                description: '',
                assigned: []
            }}
            validationSchema={validationSchema}
            onSubmit={(values, help) => {
                onAdd(values)
                help?.resetForm()
            }}
        >
            {({ values, setFieldValue, handleSubmit }) => {
                return <Grid container spacing={2}>
                    <Grid item xs={6} md={12}>
                        <FastField
                            component={TextField}
                            name={'name'}
                            fullWidth
                            label={"Tên phiên họp"}
                            required
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={6} md={12}>
                        <FastField
                            component={TextField}
                            name={'description'}
                            fullWidth
                            label={"Mô tả phiên họp"}
                            required
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={6} md={12}>
                        <Box>
                            <Switch checked={Boolean(values.status)} onChange={() => setFieldValue('status', !Boolean(values.status))} />
                            {Boolean(values.status) ? "Kích hoạt" : "Không kích hoạt"}
                        </Box>
                    </Grid>
                    <Grid item xs={6} md={12}>
                        <FastField
                            component={AutoCompleteField}
                            name="assigned"
                            multiple
                            fullWidth
                            required
                            onChangeCustomize={(e: any, value: any) => {
                                setFieldValue('assigned', value)
                            }}
                            options={listUser?.map((e: any) => ({
                                label: e?.name,
                                value: e?.id,
                            })) ?? []}
                            label={'Thành viên'}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex' }}>
                            <Typography onClick={() => handleSubmit()} p={1} sx={{ backgroundColor: "#2f8a46", color: 'white', borderRadius: '10px', fontWeight: 'bold' }}>
                                Tạo mới
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>
            }}
        </Formik>
    </Box>
}

export default AddMeeting
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import TypographyCommon from '../../../component/Typography';
import UploadFile from '../../../component/UploadFile';
import { renderLogo } from '../../../component/UploadFile/Drag';
import DialogCommon from '../../../component/dialog';
import { ROOT_URL_ASSET } from '../../../const/api';
import { colors } from '../../../const/colors';
import { downloadFile, formatBytes, uploadFile } from '../../../helper/function';
import useFiltersHandler from '../../../hooks/useFilters';
import useGetListDocument from '../../../hooks/useGetListDocument';
import useGetListDocumentNote from '../../../hooks/useGetListDocumentNote';
import { IAddDocumentNote } from '../../../interface/document';
import DocumentServices from '../../../services/Document.services';

interface IProps {
    meetingId: any
}

const GeneralNote = (props: IProps) => {
    // props
    const { meetingId } = props

    // state
    const [openDialogViewNote, setOpenDialogViewNote] = useState(false)
    const [openDialogUpload, setOpenDialogUpload] = useState(false)
    const [meetingDocumentId, setMeetingDocumentId] = useState<any>()
    const [meetingDocumentName, setMeetingDocumentName] = useState<any>()
    const [linkFile, setLinkFile] = useState<any>('')
    const [noteMemberTemp, setNoteMemberTemp] = useState<string>('');
    const [files, setFiles] = useState<File[] | null>(null)


    // data
    // list document
    const { filters } = useFiltersHandler({ page: 0, meetingId })
    const { data: listDocument, refetch: refetchListDocument } = useGetListDocument(filters)

    // document note
    const { filters: filterDocumentNote } = useFiltersHandler({ page: 0, meetingDocumentId })
    const { data: dataDocumentNote, refetch } = useGetListDocumentNote(filterDocumentNote, { isTrigger: false })

    // function
    const handleAdd = async () => {
        const body: IAddDocumentNote = {
            content: noteMemberTemp,
            meetingDocumentId: meetingDocumentId
        }
        const response = await DocumentServices.addDocumentNote(body)
        if (response.status === 200 || response.status === 201) {
            refetch({ ...filterDocumentNote, meetingDocumentId: meetingDocumentId })
        }
        setNoteMemberTemp('')
    }

    const handleChooseFile = async (files: File[] | null) => {
        try {
            if (files) {
                files?.forEach(async (e) => {
                    await uploadFile({
                        file: e,
                        meetingId: meetingId,
                        onSuccess: () => {
                            setFiles((prev) => ([...(prev || []), e]))
                        }
                    })
                })
            }
        } catch {

        } finally {
            refetchListDocument()
            console.log('asasasas')
        }
       
    }


    return <>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <TypographyCommon style={{ color: colors.text.white, fontWeight: '700', textAlign: 'left' }} py={1}>
                Tài liệu chia sẻ
            </TypographyCommon>

            <Box
                sx={{
                    display: 'flex',
                    overflow: 'scroll',
                    width: '100%',
                    height: '100%',
                    '&::-webkit-scrollbar': {
                        display: 'none' // Ẩn thanh cuộn trên trình duyệt Chrome
                    },
                    '-ms-overflow-style': 'none', // Ẩn thanh cuộn trên trình duyệt Edge
                    scrollbarWidth: 'none' // Ẩn thanh cuộn trên trình duyệt Firefox
                }}
            >
                <Box sx={{ maxHeight: '100%', width: '100%', }} px={1} pb={1}>
                    {listDocument?.data?.map((e, index) => {
                        return <Box mt={2} key={index} sx={{ backgroundColor: colors.background.grey, borderRadius: '5px', boxShadow: '0px 0px 6px 1px rgba(255,255,255,0.54)' }}>
                            <Button
                                sx={{
                                    display: 'flex',
                                    textTransform: 'none'
                                }}
                                fullWidth
                                onClick={() => {
                                    downloadFile(`${ROOT_URL_ASSET}${e?.filePath}`, e?.fileName)
                                }}
                            // onClick={() => {
                            //     setOpenDialogViewNote(true)
                            //     setMeetingDocumentId(e?.id)
                            //     setMeetingDocumentName(e?.fileName)
                            //     setLinkFile(e?.filePath)
                            //     refetch({ ...filterDocumentNote, meetingDocumentId: e?.id })
                            // }}
                            >
                                <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                    <img src={renderLogo(e?.fileName?.split('.')?.pop() || '')} alt={'logo'} style={{ width: '50px', height: '50px' }} />
                                    <Box>
                                        <TypographyCommon pl={1} style={{ textAlign: 'left', color: colors.text.white, fontWeight: '600' }}>
                                            {e?.fileName}
                                        </TypographyCommon>
                                        <TypographyCommon pl={1} style={{ textAlign: 'left', color: colors.text.white, fontSize: '14px' }}>
                                            {`${formatBytes(Number(e?.fileSize || 0))} - ${e?.creator?.fullname}`}
                                        </TypographyCommon>
                                    </Box>
                                </Box>
                            </Button>
                        </Box>
                    })}
                </Box>



            </Box>
            <Box mb={1} pt={1}>
                <Box>
                    <Button fullWidth variant='contained' onClick={() => setOpenDialogUpload(true)} sx={{ fontWeight: '600', textTransform: 'none' }}>Thêm tài liệu</Button>
                </Box>
                <DialogCommon 
                    title={'Tải lên tài liệu'} 
                    open={openDialogUpload}
                    handleClose={() => {
                        setOpenDialogUpload(false)
                        setFiles(null)
                    }}
                    content={
                        <Box sx={{ zIndex: 999999, width: '55vw', minHeight: '25vh' }}>
                            <UploadFile 
                                onFileSelected={handleChooseFile} 
                                handleClose={() => {
                                    setOpenDialogUpload(false)
                                    setFiles(null)
                                }} 
                                files={files} />
                        </Box>
                    } />
            </Box>
        </Box>

        {/* <DialogCommon
            handleClose={() => setOpenDialogViewNote(false)}
            open={openDialogViewNote}
            title={`Ghi chú của ${meetingDocumentName}`}
            content={<Box sx={{ display: 'flex', width: '50vw', height: '75vh' }}>
                <Box sx={{ width: '100%' }}>
                    <Box mb={2} mt={2} >
                        {dataDocumentNote?.data?.map((e, index) => {
                            return <TypographyCommon sx={{ fontSize: 16 }} >{`${index + 1}. ${e?.content}`}</TypographyCommon>
                        })}
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            value={noteMemberTemp}
                            onChange={(e) => setNoteMemberTemp(e?.target?.value || '')}
                            fullWidth
                            placeholder='Thêm ghi chú'
                        />
                        <IconButton onClick={handleAdd}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>}
        /> */}
    </>
}
export default GeneralNote
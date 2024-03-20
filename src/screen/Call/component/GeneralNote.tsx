import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Divider, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import TypographyCommon from '../../../component/Typography';
import UploadFile from '../../../component/UploadFile';
import ButtonDialog from '../../../component/dialog/ButtonDialog';
import { ROOT_URL_ASSET } from '../../../const/api';
import { downloadFile, uploadFile } from '../../../helper/function';
import useFiltersHandler from '../../../hooks/useFilters';
import useGetListDocument from '../../../hooks/useGetListDocument';
import useGetListDocumentNote from '../../../hooks/useGetListDocumentNote';
import { IAddDocumentNote } from '../../../interface/document';
import DocumentServices from '../../../services/Document.services';
import DragAndDrop from '../../../component/UploadFile/Drag';
import DropzoneDialogExample from '../../../component/UploadFile/DropZoneDialog';
import DialogCommon from '../../../component/dialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DownloadOutlined } from '@mui/icons-material';

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
        if (files) {
            files?.forEach(async (e) => {
                await uploadFile({
                    file: e,
                    meetingId: meetingId,
                    onSuccess: () => {
                        refetchListDocument()
                    }
                })
            })
        }
    }


    return <>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <TypographyCommon pb={1} style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', color: '#5c5c5c', textTransform: 'uppercase' }} py={1}>
                Tài liệu chia sẻ
            </TypographyCommon>
            <Divider />

            <Box sx={{
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
                <Box sx={{ maxHeight: '100%', width: '100%', }}>
                    {listDocument?.data?.map((e, index) => {
                        return <Button sx={{
                            display: 'flex',
                            textTransform: 'none'
                        }}
                        fullWidth
                            onClick={() => {
                                setOpenDialogViewNote(true)
                                setMeetingDocumentId(e?.id)
                                setMeetingDocumentName(e?.fileName)
                                setLinkFile(e?.filePath)
                                refetch({ ...filterDocumentNote, meetingDocumentId: e?.id })
                            }}>
                            <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AttachmentIcon style={{ height: '30px', width: '30px' }} />
                                    <TypographyCommon pl={1} sx={{ textAlign: 'left' }}>
                                        {e?.fileName}
                                    </TypographyCommon>
                                </Box>
                                <InfoOutlinedIcon />
                                {/* <Button>
                                        Xem chi tiết
                                    </Button> */}
                            </Box>
                        </Button>
                        // return <Box key={index} sx={{
                        //     width: '100%',
                        //     cursor: 'pointer',
                        //     "& :hover ": {
                        //         borderRadius: '5px',
                        //         backgroundColor: "#d1d1d1"
                        //     }
                        // }}>
                        //     <Box
                        //         p={1}
                        //         sx={{
                        //             display: 'flex',
                        //         }}
                        //         onClick={() => {
                        //             setOpenDialogViewNote(true)
                        //             setMeetingDocumentId(e?.id)
                        //             setMeetingDocumentName(e?.fileName)
                        //             setLinkFile(e?.filePath)
                        //             refetch({ ...filterDocumentNote, meetingDocumentId: e?.id })
                        //         }}>
                        //         <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', }}>
                        //             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        //                 <AttachmentIcon style={{ height: '30px', width: '30px' }} />
                        //                 <TypographyCommon pl={1} sx={{ textAlign: 'left' }}>
                        //                     {e?.fileName}
                        //                 </TypographyCommon>
                        //             </Box>
                        //             <InfoOutlinedIcon />
                        //             {/* <Button>
                        //                 Xem chi tiết
                        //             </Button> */}
                        //         </Box>
                        //     </Box>
                        //     {/* <Divider /> */}
                        // </Box>
                    })}
                </Box>



            </Box>
            <Box mb={1} pt={1}>
                <Box>
                    <Button fullWidth variant='contained' onClick={() => setOpenDialogUpload(true)}>Thêm tài liệu</Button>
                </Box>
                <DialogCommon open={openDialogUpload} handleClose={() => setOpenDialogUpload(false)}
                    content={
                        <Box sx={{ zIndex: 999999 }}>
                            <UploadFile onFileSelected={handleChooseFile} handleClose={() => setOpenDialogUpload(false)} />
                        </Box>
                    } />
            </Box>
        </Box>



        <ButtonDialog
            open={openDialogViewNote}
            onToggle={(value) => {
                setOpenDialogViewNote(value)
            }}
            text={<></>}
            content={<Box sx={{ display: 'flex', minWidth: '500px' }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TypographyCommon mb={1} sx={{ fontSize: '20px' }}>
                            {`Ghi chú của ${meetingDocumentName}`}
                        </TypographyCommon>
                        <Button color='primary' variant='contained' onClick={() => downloadFile(`${ROOT_URL_ASSET}${linkFile}`, meetingDocumentName)} ><DownloadOutlined /></Button>
                    </Box>
                    {/* <Divider /> */}
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
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                        <Button
                            variant='contained'
                            // sx={{backgroundColor: '#1e703b', color: 'white', fontWeight: 'bold'}} 
                            onClick={() => downloadFile(`${ROOT_URL_ASSET}${linkFile}`, meetingDocumentName)}
                        >
                            Tải xuống
                        </Button>

                    </Box> */}

                </Box>
            </Box>}
        />
    </>
}
export default GeneralNote
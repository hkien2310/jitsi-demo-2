import React from 'react'
import AuthServices from '../../../services/Auth.services'
import { Box, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { uploadFile } from '../../../helper/function';
import useGetListDocument from '../../../hooks/useGetListDocument';
import useFiltersHandler from '../../../hooks/useFilters';
import { ROOT_URL_ASSET } from '../../../const/api';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ButtonDialog from '../../../component/dialog/ButtonDialog';
import useGetListDocumentNote from '../../../hooks/useGetListDocumentNote';
import DocumentServices from '../../../services/Document.services';
import { IAddDocumentNote } from '../../../interface/document';
import useGetListMeetingNote from '../../../hooks/useGetListMeetingNote';
import MeetingServices from '../../../services/Meeting.services';

interface IFile {
    url: string
    name: string
}

interface IProps {
    meetingId: any
    isSecretary: boolean
}

const DocumentShow = (props: IProps) => {
    const { meetingId, isSecretary } = props
    const [openDialog, setOpenDialog] = React.useState(false)
    const [meetingDocumentId, setMeetingDocumentId] = React.useState<any>()
    const [meetingDocumentName, setMeetingDocumentName] = React.useState<any>()

    const [noteMemberTemp, setNoteMemberTemp] = React.useState<string>('');
    const [noteWriteTemp, setNoteWriterTemp] = React.useState<string>('');
    const { filters } = useFiltersHandler({ page: 0, meetingId })
    const { filters: filterDocumentNote } = useFiltersHandler({ page: 0, meetingDocumentId })
    const { data: listDocument, refetch: refetchListDocument } = useGetListDocument(filters)
    const { data: dataDocumentNote, refetch } = useGetListDocumentNote(filterDocumentNote, { isTrigger: false })
    const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0, meetingId })
    const {data: dataListMeetingNote, refetch: refetchMeetingNote} = useGetListMeetingNote(filtersMeetingNote)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            uploadFile({
                file: event?.target?.files?.[0] || null,
                meetingId: meetingId,
                onSuccess: () => {
                    refetchListDocument()
                }
            })
        }
    };


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

    const handleWriterAddNote = async () => {
        const body = {
            meetingId: Number(meetingId),
            content: noteWriteTemp
        }
        const response = await MeetingServices.createMeetingNote(body)
        if (response.status === 200 || response.status === 201) {
            refetchMeetingNote()
        }
        setNoteWriterTemp('')
    }

    const renderGeneralNote = () => {
        return <>
            <Box sx={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid grey' }}>
                Tài liệu chia sẻ
            </Box>
            <Box sx={{ flex: 1 }}>
                {listDocument?.data?.map((e, index) => {
                    return <Box key={index}>
                        <Box
                            p={1}
                            sx={{ display: 'flex' }}
                            onClick={() => {
                                setOpenDialog(true)
                                setMeetingDocumentId(e?.id)
                                setMeetingDocumentName(e?.fileName)
                                refetch({ ...filterDocumentNote, meetingDocumentId: e?.id })
                            }}>
                            <Box pr={1}>
                                <AttachmentIcon />
                            </Box>
                            <Typography>
                                {e?.fileName}
                            </Typography>
                        </Box>
                    </Box>
                })}
            </Box>
            <ButtonDialog
                open={openDialog}
                onToggle={(value) => {
                    setOpenDialog(value)
                }}
                text={<></>}
                content={<Box sx={{ display: 'flex' }}>
                    <Box>
                        <Box mb={1} sx={{ borderBottom: '1px solid' }}>
                            {`Ghi chú của ${meetingDocumentName}`}
                        </Box>
                        <Box>
                            {dataDocumentNote?.data?.map((e, index) => {
                                return <Typography>{`${index + 1}. ${e?.content}`}</Typography>
                            })}
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                value={noteMemberTemp}
                                onChange={(e) => setNoteMemberTemp(e?.target?.value || '')}
                                fullWidth
                                placeholder='Thêm ghi chú'
                            />
                            <Box p={2} onClick={handleAdd}>
                                <SendIcon />
                            </Box>
                        </Box>

                    </Box>
                </Box>} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <input id='selectImage' hidden type="file" onChange={handleFileChange} />
                <label htmlFor='selectImage'>
                    <Box p={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <AttachFileIcon />
                        <Typography>
                            Thêm tài liệu ghi chú
                        </Typography>
                    </Box>
                </label>
            </Box>
        </>
    }

    const renderWriterNote = () => {
        return <>
            <Box sx={{ fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid grey' }}>
                Ghi chú của thư ký
            </Box>
            <Box sx={{ flex: 1 }}>
                {dataListMeetingNote?.data?.map((e, index) => {
                    return <Box key={index}>
                        <Box
                            p={1}
                            sx={{ display: 'flex' }}
                        >
                            {/* <Box pr={1}>
                                <AttachmentIcon />
                            </Box> */}
                            <Typography>
                                {e?.content}
                            </Typography>
                        </Box>
                    </Box>
                })}
            </Box>
            <Box p={2} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    value={noteWriteTemp}
                    onChange={(e) => setNoteWriterTemp(e?.target?.value || '')}
                    fullWidth
                    placeholder='Thêm ghi chú'
                />
                <Box p={2} onClick={handleWriterAddNote}>
                    <SendIcon />
                </Box>
            </Box>
        </>
    }

    return <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderBottom: '1px solid' }} p={1}>
            {renderGeneralNote()}
        </Box>
        {isSecretary ?
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, borderBottom: '1px solid' }} p={1}>
                {renderWriterNote()}
            </Box>
            : <></>}
    </Box>
}

export default DocumentShow
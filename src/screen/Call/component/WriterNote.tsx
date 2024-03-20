import SendIcon from '@mui/icons-material/Send';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import useFiltersHandler from '../../../hooks/useFilters';
import useGetListMeetingNote from '../../../hooks/useGetListMeetingNote';
import { useState } from 'react';
import MeetingServices from '../../../services/Meeting.services';
import TypographyCommon from '../../../component/Typography';

interface IProps {
    meetingId: any
}
const WriterNote = (props: IProps) => {
    // props
    const { meetingId } = props
    // state
    const [noteWriteTemp, setNoteWriterTemp] = useState<string>('');

    // data
    const { filters: filtersMeetingNote } = useFiltersHandler({ page: 0, meetingId })
    const { data: dataListMeetingNote, refetch: refetchMeetingNote } = useGetListMeetingNote(filtersMeetingNote)

    // function

    const handleWriterAddNote = async () => {
        if(noteWriteTemp.trim()) {
            const body = {
                meetingId: Number(meetingId),
                content: noteWriteTemp
            }
            const response = await MeetingServices.createMeetingNote(body)
            if (response.status === 200 || response.status === 201) {
                refetchMeetingNote()
            }
        }
        setNoteWriterTemp('')
    }

    // render
    return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        <TypographyCommon pb={1} style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left', color: '#5c5c5c', textTransform: 'uppercase' }} py={1}>
            Ghi chú của thư ký
        </TypographyCommon>
        <Divider />
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'scroll',
            '&::-webkit-scrollbar': {
                display: 'none' // Ẩn thanh cuộn trên trình duyệt Chrome
            },
            '-ms-overflow-style': 'none', // Ẩn thanh cuộn trên trình duyệt Edge
            scrollbarWidth: 'none' // Ẩn thanh cuộn trên trình duyệt Firefox
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'scroll', flex: 1 }}>
                {dataListMeetingNote?.data?.map((e, index) => {
                    return <Box key={index}>
                        <Box
                            p={1}
                            sx={{ display: 'flex' }}
                        >
                            <TypographyCommon sx={{ textAlign: 'left' }}>
                                {e?.content}
                            </TypographyCommon>
                        </Box>
                    </Box>
                })}
            </Box>
            <Box mb={1} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    value={noteWriteTemp}
                    onChange={(e) => setNoteWriterTemp(e?.target?.value || '')}
                    fullWidth
                    placeholder='Thêm ghi chú'
                />
                <Box p={2}>
                    <IconButton onClick={handleWriterAddNote}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    </Box>
}
export default WriterNote
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import useFiltersHandler from '../../../hooks/useFilters';
import useGetListMeetingNote from '../../../hooks/useGetListMeetingNote';
import { useState } from 'react';
import MeetingServices from '../../../services/Meeting.services';
import TypographyCommon from '../../../component/Typography';
import { colors } from '../../../const/colors';

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
        if (noteWriteTemp.trim()) {
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

        <TypographyCommon pb={1} style={{ color: colors.text.white, fontSize: '20px', fontWeight: '700', textAlign: 'left', textTransform: 'uppercase' }} py={1}>
            Ghi chú của thư ký
        </TypographyCommon>
        {/* <Divider /> */}
        <Box
            pt={1}
            sx={{
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
                            <TypographyCommon style={{ textAlign: 'left', color: colors.text.white, }}>
                                {e?.content}
                            </TypographyCommon>
                        </Box>
                    </Box>
                })}
            </Box>
            <Box pt={1} mb={1} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    value={noteWriteTemp}
                    onChange={(e) => setNoteWriterTemp(e?.target?.value || '')}
                    fullWidth
                    placeholder='Thêm ghi chú'
                    InputProps={{
                        style: {
                            background: colors.background.grey,
                            color: colors.text.white, // Màu của văn bản đầu vào
                        },
                    }}
                />
                <Box pl={1}>
                    <Button onClick={handleWriterAddNote} style={{ backgroundColor: colors.background.grey2, height: '56px', width: '56px'}}>
                        <SendIcon style={{ color: colors.background.grey }} />
                    </Button>
                </Box>
            </Box>
        </Box>
    </Box>
}
export default WriterNote
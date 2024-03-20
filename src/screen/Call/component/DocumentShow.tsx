import { Box, Divider } from '@mui/material';
import GeneralNote from './GeneralNote';
import WriterNote from './WriterNote';

interface IProps {
    meetingId: any
    isSecretary: boolean
}

const DocumentShow = (props: IProps) => {
    const { meetingId, isSecretary } = props


    return <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }} px={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: isSecretary ? '50%' : '100%' }}>
            <GeneralNote meetingId={meetingId} />
        </Box>
        {isSecretary ?
            <>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '50%' }}>
                    <WriterNote meetingId={meetingId} />
                </Box>
            </>
            : <></>}
    </Box>
}

export default DocumentShow
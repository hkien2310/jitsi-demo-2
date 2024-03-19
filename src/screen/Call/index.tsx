import React, {useRef} from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useLocation } from 'react-router-dom';
import { searchParamsToObject } from '../../helper/function';
import { Box, Grid } from '@mui/material';
import DocumentShow from './component/DocumentShow';

export interface IParamsCall {
    room: string
    roomName: string
    userName: string
    email?: string
}


const renderSpinner = () => (
    <div style={{
        fontFamily: 'sans-serif',
        textAlign: 'center'
    }}>
        Loading..
    </div>
);

const CallScreen = () => {
    const location = useLocation();
    // const apiRef = useRef();
    const [api, setApi] = React.useState(null);


    const search = searchParamsToObject(location?.search || '')
    const { room, roomName, userName, email } = search ?? {}
    console.log(search, 'searchsearch')
    // const ticketId = location.pathname.split("/")[2];

    // const params = location?.state as IParamsCall
    const handleJitsiIFrameRef1 = (iframeRef: any) => {
        const height = window.innerHeight
        const width = window.innerWidth
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = `${height}px`;
        // iframeRef.style.width = `${width}px`;
        iframeRef.style.border = `none`;
    };

    const handleApiReady = (apiObj: any) => {
        // apiRef.current = apiObj;
        setApi(apiObj)
        setTimeout(() => {
            apiObj.executeCommand('toggleChat');
        }, 3000);
        // apiObj?.executeCommand?.('toggleChat');

        // apiRef.current.on('knockingParticipant', handleKnockingParticipant);
        // apiRef.current.on('audioMuteStatusChanged', payload => handleAudioStatusChange(payload, 'audio'));
        // apiRef.current.on('videoMuteStatusChanged', payload => handleAudioStatusChange(payload, 'video'));
        // apiRef.current.on('raiseHandUpdated', printEventOutput);
        // apiRef.current.on('titleViewChanged', printEventOutput);
        // apiRef.current.on('chatUpdated', handleChatUpdates);
        // apiRef.current.on('knockingParticipant', handleKnockingParticipant);
    };

    // React.useEffect(() => {
    //     if (api) {
    //       //@ts-ignore
    //       api.executeCommand('toggleChat'); // Open chat window
    //     }
    //   }, [api]);


    return <Box sx={{ width: '100vw', height: '100vh' }}>
        <Grid container>
            <Grid item xs={12} md={9}>
                <JitsiMeeting
                    roomName={`${room}`}
                    spinner={renderSpinner}
                    domain={'vid-dev.digiworkhub.com'}
                    // domain={'103.143.142.245:8443'}
                    configOverwrite={{
                        subject: `${roomName}`,
                        hideConferenceSubject: false,
                    }}
                    userInfo={{
                        displayName: userName,
                        email: email || ''
                    }}
                    lang={'vi'}
                    onApiReady={externalApi => handleApiReady(externalApi)}
                
                    // @ts-ignore
                    // onReadyToClose={() => apiRef.current?.executeCommand?.('toggleChat')}
                    getIFrameRef={handleJitsiIFrameRef1}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <DocumentShow meetingId={room}/>
            </Grid>
        </Grid>

    </Box>
}

export default CallScreen
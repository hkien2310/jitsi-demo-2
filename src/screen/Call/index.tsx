import React from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useLocation } from 'react-router-dom';
import { searchParamsToObject } from '../../helper/function';
import { Box } from '@mui/material';

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
    const search = searchParamsToObject(location?.search || '')
    const {room, roomName, userName, email} = search ?? {}
    // const ticketId = location.pathname.split("/")[2];

    // const params = location?.state as IParamsCall
    const handleJitsiIFrameRef1 = (iframeRef: any) => {
        const height = window.innerHeight
        const width = window.innerWidth
        iframeRef.style.border = '10px solid #3d3d3d';
        iframeRef.style.background = '#3d3d3d';
        iframeRef.style.height = `${height}px`;
        iframeRef.style.width = `${width}px`;
        iframeRef.style.marginBottom = '20px';
    };


    return <Box sx={{width: '100vw', height: '100vh'}}>
        <JitsiMeeting
            roomName={`${room}`}
            spinner={renderSpinner}
            domain={'vid-dev.digiworkhub.com'}
            // domain={'103.143.142.245:8443'}
            configOverwrite={{
                subject: `${roomName}`,
                hideConferenceSubject: false
            }}
            userInfo={{
                displayName: userName,
                email: email || ''
            }}
            lang={'vi'}
            // onApiReady={externalApi => handleApiReady(externalApi)}
            // onReadyToClose={handleReadyToClose}
            getIFrameRef={handleJitsiIFrameRef1}
        />
    </Box>
}

export default CallScreen
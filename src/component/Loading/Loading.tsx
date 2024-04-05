import { CircularProgress } from "@mui/material"

const LoadingScreen = ({ isLoading, hideScreen }: { isLoading: boolean, hideScreen?: boolean }) => {
    // console.log(isLoading, 'isLoadingisLoading')
    if (!isLoading) return null
    // return <div style={{ zIndex: 10, background: hideScreen ? 'white' : 'rgba(0, 0, 0, 0.3)',height: '100vh', width: '100vw', position: 'fixed', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //     <CircularProgress />
    // </div>
    return ;
}

export default LoadingScreen
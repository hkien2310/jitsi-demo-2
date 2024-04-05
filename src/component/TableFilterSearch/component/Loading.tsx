import { Box, CircularProgress } from "@mui/material"

const LoadingTable = () => {
    return <Box sx={{display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center'}}>
        <CircularProgress />
    </Box>
}
export default LoadingTable
import { Box } from "@mui/material"
import { ImageSource } from "../../../assets/Image"

interface IProps {
    numeral: number,
    isInprogress?: boolean
}
const ItemDashboard = (props: IProps) => {
    const {numeral, isInprogress} = props
    return(
        <Box sx={{ boxShadow: '4px 0px 20px 0px rgba(0,0,0,0.08)', backgroundColor: 'white', display: 'flex', alignItems: 'center', padding: '32px 37px' }} >
            <img src={isInprogress ? ImageSource.inprogressIcon : ImageSource.completeIcon} style={{ width: '10px', height: '105px', marginRight: 27 }} />
            <Box>
                <Box sx={{ color: '#666666', fontSize: 20, fontWeight: 500 }} >{isInprogress ? 'Số cuộc họp đang diễn ra': 'Số cuộc họp đã diễn ra' }</Box>
                <Box sx={{ textAlign: 'left' }}><span style={{ fontSize: 40, fontWeight: 600, color:'#1A1A1A' }}>{numeral} </span> <span style={{ fontSize: 20, fontWeight: 600, color:'#1A1A1A' }}>cuộc họp</span></Box>
            </Box>
        </Box>
    )
}
export default ItemDashboard
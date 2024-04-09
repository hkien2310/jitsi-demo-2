import { Box } from "@mui/material"
import { ImageSource } from "../../../assets/Image"
import { useMemo } from "react"
import { DeviceType } from "../../../hooks/useDivices"
import { useGet } from "../../../store/useStores"
import cacheKeys from "../../../const/cachedKeys"

interface IProps {
    numeral: number,
    isInprogress?: boolean
}
const ItemDashboard = (props: IProps) => {
    const {numeral, isInprogress} = props
    const deviceType = useGet(cacheKeys.DEVICE_TYPE)
    const isMobile = useMemo(() => {
        return deviceType === DeviceType.MOBILE
      }, [deviceType])
    return(
        <Box sx={{ boxShadow: '4px 0px 20px 0px rgba(0,0,0,0.08)', backgroundColor: 'white', display: 'flex', alignItems: 'center'}} px={isMobile ? 2 : 5} py={isMobile ? 2 : 4}>
            <img src={isInprogress ? ImageSource.inprogressIcon : ImageSource.completeIcon} style={{ width: '10px', height: '105px', marginRight: 27 }} alt={''}/>
            <Box>
                <Box sx={{ color: '#666666', fontSize: 20, fontWeight: 500 }} >{isInprogress ? 'Số cuộc họp đang diễn ra': 'Số cuộc họp đã diễn ra' }</Box>
                <Box sx={{ textAlign: 'left' }}><span style={{ fontSize: 40, fontWeight: 600, color:'#1A1A1A' }}>{numeral} </span> <span style={{ fontSize: 20, fontWeight: 600, color:'#1A1A1A' }}>cuộc họp</span></Box>
            </Box>
        </Box>
    )
}
export default ItemDashboard
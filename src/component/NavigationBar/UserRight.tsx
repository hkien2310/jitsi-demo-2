import { Box, Button, Popover, Typography } from '@mui/material'
import React from 'react'
import { useGet, useSave } from '../../store/useStores'
import cacheKeys from '../../const/cachedKeys'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IUserItem } from '../../interface/user';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthServices from '../../services/Auth.services';
import { ImageSource } from '../../assets/Image';
import { colors } from '../../const/colors';
import Badge from '@mui/material/Badge';


const UserRight = () => {
    const userInfo: IUserItem = useGet(cacheKeys.USER_INFO)
    const save = useSave()

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    return <Box sx={{display: 'flex'}}>
        <Box mr={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '41px', width: '41px', border: `1px solid ${colors.border.noti}`, borderRadius: 1000 }}>
            <Badge color="error" variant="dot" invisible={false}>
                <img src={ImageSource.notification} alt={''} />
            </Badge>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={(e: any) => handleClick(e)}>
            <AccountCircleIcon sx={{ height: '41px', width: '41px' }} />
            <Box pl={1} sx={{ fontSize: '16px', textTransform: 'capitalize' }}>
                {userInfo?.fullname}
            </Box>
        </Box>
        {/* <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            style={{ marginTop: '10px' }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <Box p={1}>
                <Button color={'error'} sx={{ display: 'flex', flexDirection: 'row' }} onClick={async () => {
                    await AuthServices.logout()
                    save(cacheKeys.IS_LOGGED, false)
                }}
                    startIcon={<LogoutIcon />}
                >
                    <Box pl={1}>
                        Đăng xuất
                    </Box>
                </Button>
            </Box>
        </Popover> */}
    </Box>
}

export default UserRight
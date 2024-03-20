import { Box, Button, Popover, Typography } from '@mui/material'
import React from 'react'
import { useGet, useSave } from '../../store/useStores'
import cacheKeys from '../../const/cachedKeys'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IUserItem } from '../../interface/user';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthServices from '../../services/Auth.services';

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


    return <Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={(e: any) => handleClick(e)}>
            <AccountCircleIcon />
            <Box pl={1}>
                {userInfo?.fullname}
            </Box>
        </Box>
        <Popover
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
        </Popover>
    </Box>
}

export default UserRight
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { EnumMeetingStatus, meetingStatus } from '../columns';
import { colors } from '../../../const/colors';
import ButtonCommon from '../../../component/Button';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));


interface IProps {
    value: EnumMeetingStatus
    onChange: (value: string) => void
}

export default function StatusSelect(props: IProps) {
    const { value, onChange } = props
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value: string) => {
        setAnchorEl(null);
        onChange(value)
    };

    return (
        <>
            <ButtonCommon
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                style={{ backgroundColor: colors.background.primary, borderRadius: '8px', height: '100%', textTransform: 'none', fontSize: '16px' }}
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
            >
                {Boolean(value) ? meetingStatus[EnumMeetingStatus[value]] : 'Bộ lọc'}
            </ButtonCommon>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={(e) => handleClose(value)}
            >
                <MenuItem onClick={() => handleClose('')} disableRipple>
                    <em>Bộ lọc</em>
                </MenuItem>
                {(Object.keys(EnumMeetingStatus) as Array<keyof typeof EnumMeetingStatus>).map((key, index) => {
                    return <MenuItem onClick={() => handleClose(EnumMeetingStatus[key])} disableRipple key={index} style={value === EnumMeetingStatus[key] ? { backgroundColor: colors.background.primary, color: colors.text.white } : {}}>
                        {meetingStatus[EnumMeetingStatus[key]]}
                    </MenuItem>
                })}
            </StyledMenu>
        </>
    );
}

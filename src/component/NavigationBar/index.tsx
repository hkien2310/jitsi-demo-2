import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserRight from './UserRight';
import { colors } from '../../const/colors';
import TypographyCommon from '../Typography';
import { ImageSource } from '../../assets/Image';

const drawerWidth = 350;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface MainLayoutProps {
    children: React.ReactNode;
}

const listSideBar = [
    // {path: '/call', name: "Call"},
    { path: '/dashboard', name: "Dash Board", icon: ImageSource.category},
    { path: '/', name: "Quản lý cuộc họp", icon: ImageSource.monitor},
    { path: '', name: "Quản lý nhóm quyền", icon: ImageSource.people},
    { path: '', name: "Quản lý tài khoản", icon: ImageSource.data},
]

const NavigationBar = ({ children }: MainLayoutProps) => {
    const location = useLocation();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        setOpen((prev) => !prev)
    }


    return (
        <Box sx={{ display: 'flex', maxWidth: '100vw', height: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ backgroundColor: colors.header.main, zIndex: 100000000 }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleToggle}
                                edge="start"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <TypographyCommon style={{ color: colors.text.header, fontSize: '24px', fontWeight: 500 }} noWrap component="div">
                                Hệ thống quản lý cuộc họp
                            </TypographyCommon>
                        </Box>
                        <Box>
                            <UserRight />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: colors.background.sideBar,
                        // minWidth: '25vw',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleToggle}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{padding: '8px'}}>
                    {listSideBar.map((text, index) => (
                        <ListItem key={index} disablePadding onClick={() => navigate(text.path)}>
                            <ListItemButton
                                style={{
                                    backgroundColor: text?.path === location.pathname ? colors.background.sideBarSelected : 'unset',
                                    color: colors.text.white,
                                    fontWeight: 500,
                                    borderRadius: '10px',
                                }}>
                                <ListItemIcon>
                                    <img src={text?.icon} alt='' />
                                </ListItemIcon>
                                <ListItemText primary={text?.name} sx={{
                                    "& .MuiListItemText-primary": {
                                        fontWeight: 500
                                    }}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                {/* <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List> */}
                {/* <Button variant='contained' onClick={async () => {
                    AuthServices.logout()
                    save(cacheKeys.IS_LOGGED, false)
                }}>
                    Đăng xuất
                </Button> */}
            </Drawer>

            <Main open={open} sx={{ width: '100%', height: '100%' }}>
                <DrawerHeader />
                {children}
                {/* {props?.children} */}
            </Main>
        </Box>
    );
}

export default NavigationBar
import React, {useState} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from 'react-router-dom';
import {User} from "../types/auth";

interface NavbarProps {
    user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({user}) => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    const menuId = 'primary-search-account-menu-mobile';

    return (
        <Box sx={{position: "fixed", top: "0", width: "100vw", zIndex: 2}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/home')}
                    >
                        SPME
                    </Typography>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        {user ? (
                            <>
                                <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                                <MenuItem onClick={() => navigate('/upload')}>Upload</MenuItem>
                                <MenuItem onClick={() => navigate('/photo-gallery')}>Gallery</MenuItem>
                                {user.RoleID === 1 && (
                                    <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
                                )}
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        )}
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                id={menuId}
                keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={Boolean(mobileMoreAnchorEl)}
                onClose={handleMobileMenuClose}
            >
                {user ? (
                    <>
                        <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                        <MenuItem onClick={() => navigate('/upload')}>Upload</MenuItem>
                        <MenuItem onClick={() => navigate('/photo-gallery')}>Gallery</MenuItem>
                        {user.RoleID === 1 && (
                            <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
                        )}
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </>
                ) : (
                    <MenuItem onClick={() => navigate('/register')}>Register</MenuItem>
                )}
            </Menu>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{width: 250}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        {user ? (
                            <>
                                <ListItem onClick={() => navigate('/dashboard')}>
                                    <ListItemText primary="Dashboard"/>
                                </ListItem>
                                <ListItem onClick={() => navigate('/upload')}>
                                    <ListItemText primary="Upload"/>
                                </ListItem>
                                <ListItem onClick={() => navigate('/photo-gallery')}>
                                    <ListItemText primary="Gallery"/>
                                </ListItem>
                                {user.RoleID === 1 && (
                                    <ListItem onClick={() => navigate('/admin')}>
                                        <ListItemText primary="Admin"/>
                                    </ListItem>
                                )}
                                <ListItem onClick={handleLogout}>
                                    <ListItemText primary="Logout"/>
                                </ListItem>
                            </>
                        ) : (
                            <ListItem onClick={() => navigate('/register')}>
                                <ListItemText primary="Register"/>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Navbar;

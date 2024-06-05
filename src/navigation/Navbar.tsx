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
import {parseJwt} from '../helpers/parseJwt';

const Navbar: React.FC = () => {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const user = token ? parseJwt(token) : null;

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
        <Box sx={{position: "fixed", top: "0", width: "100vw"}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{flexGrow: 1}}>
                        SPME
                    </Typography>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                        <MenuItem onClick={() => navigate('/upload')}>Upload</MenuItem>
                        <MenuItem onClick={() => navigate('/photo-gallery')}>Gallery</MenuItem>
                        <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
                        {user && (
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
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
                <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                <MenuItem onClick={() => navigate('/upload')}>Upload</MenuItem>
                <MenuItem onClick={() => navigate('/photo-gallery')}>Gallery</MenuItem>
                <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
                {user && (
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
                        <ListItem onClick={() => navigate('/dashboard')}>
                            <ListItemText primary="Dashboard"/>
                        </ListItem>
                        <ListItem onClick={() => navigate('/upload')}>
                            <ListItemText primary="Upload"/>
                        </ListItem>
                        <ListItem onClick={() => navigate('/photo-gallery')}>
                            <ListItemText primary="Gallery"/>
                        </ListItem>
                        <ListItem onClick={() => navigate('/admin')}>
                            <ListItemText primary="Admin"/>
                        </ListItem>
                        {user && (
                            <ListItem onClick={handleLogout}>
                                <ListItemText primary="Logout"/>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Navbar;

import React, {useState} from 'react';
import GoogleLoginComponent from './GoogleLoginComponent';
import GitHubLoginComponent from './GitHubLoginComponent';
import EmailRegisterComponent from './EmailRegisterComponent';
import {User} from '../../types/auth';
import {useNavigate} from 'react-router-dom';
import {Box, Typography, Link} from '@mui/material';

const MainLoginComponent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            minWidth="100vw"
            textAlign="center"
            padding={2}
        >
            <Typography variant="h3" gutterBottom>
                Join SPME!
            </Typography>
            <Box mb={2} width="100%" maxWidth="400px">
                <EmailRegisterComponent/>
            </Box>
            <Box mb={2} width="100%" maxWidth="400px">
                <GoogleLoginComponent setUser={setUser} user={user}/>
            </Box>
            <Box mb={2} width="100%" maxWidth="400px">
                <GitHubLoginComponent setUser={setUser} user={user}/>
            </Box>
            <Typography variant="body1">
                Already have an account?{' '}
                <Link
                    component="button"
                    variant="body1"
                    onClick={() => navigate('/login')}
                    sx={{color: 'primary.main', cursor: 'pointer'}}
                >
                    Login
                </Link>
            </Typography>
        </Box>
    );
};

export default MainLoginComponent;

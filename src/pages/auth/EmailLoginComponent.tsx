import React, {useState, useEffect, useCallback} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {useNavigate, useLocation} from 'react-router-dom';
import {loginUser} from '../../apis/authApi';
import {User} from '../../types/auth';
import {parseJwt} from '../../helpers/parseJwt';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';

interface EmailLoginComponentProps {
    setUser: (user: User | null) => void;
    user: User | null;
}

const EmailLoginComponent: React.FC<EmailLoginComponentProps> = ({setUser, user}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        const response = await loginUser({email, password});
        if (response.token) {
            localStorage.setItem('jwtToken', response.token);
            const decodedUser = parseJwt(response.token);
            setUser({
                UserID: decodedUser.userId,
                name: decodedUser.Username,
                Email: email,
                RoleID: decodedUser.role
            });

            // Redirect based on role
            if (decodedUser.role === 1) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            console.error('Login failed:', response.message || 'Unknown error');
        }
    };

    const handleGitHubLogin = useCallback(async (code: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code})
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                const decodedUser = parseJwt(data.token);
                setUser({
                    UserID: decodedUser.userId,
                    name: decodedUser.Username,
                    Email: decodedUser.Email,
                    RoleID: decodedUser.role
                });

                // Redirect based on role
                if (decodedUser.role === 1) {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                console.error('GitHub login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during GitHub auth:', error);
        }
    }, [navigate, setUser]);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            handleGitHubLogin(code);
        }
    }, [location, handleGitHubLogin]);

    return (
        <>
            {!user && (
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
                    <Typography variant="h4" gutterBottom>
                        Login to your account!
                    </Typography>
                    <Box width="100%" maxWidth="400px">
                        <CustomTextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <CustomTextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <CustomButton onClick={handleLogin} variant="contained" fullWidth>
                            Login
                        </CustomButton>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default EmailLoginComponent;

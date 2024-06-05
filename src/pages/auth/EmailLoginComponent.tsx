import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../apis/authApi.ts';
import { User } from '../../types/auth';
import {parseJwt} from "../../helpers/parseJwt.tsx";

interface EmailLoginComponentProps {
    setUser: (user: User | null) => void;
    user: User | null;
}

const EmailLoginComponent: React.FC<EmailLoginComponentProps> = ({ setUser, user }) => {
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
        const response = await loginUser({ email, password });
        if (response.token) {
            localStorage.setItem('jwtToken', response.token);
            const decodedUser = parseJwt(response.token);
            setUser({
                UserID: decodedUser.userId,
                name: decodedUser.Username,
                Email: email,
            });
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
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                const decodedUser = parseJwt(data.token);
                setUser({
                    UserID: decodedUser.userId,
                    name: decodedUser.Username,
                    Email: decodedUser.Email
                });
                navigate('/dashboard');
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
                <Box component="form" noValidate autoComplete="off" sx={{ width: 300, margin: 'auto', marginTop: 5 }}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button onClick={handleLogin} variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </Box>
            )}
        </>
    );
};

export default EmailLoginComponent;

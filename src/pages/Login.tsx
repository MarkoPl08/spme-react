import React, {useState} from 'react';
import {GoogleLogin} from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {loginUser} from '../api';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await loginUser({ email, password });
        if (response.token) {
            console.log('Login successful, token stored');
        } else {
            console.error('Login failed:', response.message);
        }
    };


    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    const handleGitHubLogin = () => {
        // Redirect to GitHub OAuth page using Vite environment variable
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=user`;
    };

    return (
        <>
            <Box component="form" noValidate autoComplete="off" sx={{width: 300, margin: 'auto', marginTop: 5}}>
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
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage}/>
            <div>
                <Button onClick={handleGitHubLogin} variant="contained" color="primary">
                    Login with GitHub
                </Button>
            </div>
        </>
    );
};

export default Login;

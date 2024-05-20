import React, {useCallback, useEffect, useState} from 'react';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { loginUser } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
    name: string;
    familyName: string;
}

interface GitUser {
    name: string;
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [gitUser, setGitUser] = useState<GitUser | null>(null);
    const location = useLocation();
    const navigate = useNavigate();



    const handleLogin = async () => {
        const response = await loginUser({ email, password });
        if (response.token) {
            console.log('Login successful, token stored');
        } else {
            console.error('Login failed:', response.message);
        }
    };

    const handleSuccess = (response: CredentialResponse) => {
        fetch('http://localhost:3000/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: response.credential })
        }).then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser({
                        name: data.user.Username,
                        familyName: data.user.Email
                    });
                }
            })
            .catch(error => {
                console.error('Error during Google auth:', error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('googleToken');
        setUser(null);
        setGitUser(null);
    };

    const errorMessage = () => {
        console.log('OAuth error occurred');
    };

    const initiateGitHubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = 'http://localhost:5173/login';
        const scope = 'user';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

        console.log("Redirecting to GitHub:", githubAuthUrl);
        window.location.href = githubAuthUrl;
    };

    const handleGitHubLogin = useCallback(async (code: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.user) {
                console.log('Login successful:', data.user);
                setGitUser({ name: data.user.Username });
                navigate('/login');
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during GitHub auth:', error);
        }
    }, [navigate]);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            console.log("Received GitHub code:", code);
            handleGitHubLogin(code);
        }
    }, [location, handleGitHubLogin]);

    return (
        <>
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
            {user && (
                <div>
                    <h1>Welcome, {user.name} {user.familyName}!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
            {gitUser && (
                <div>
                    <h1>Welcome, {gitUser.name}!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
            {!user && !gitUser && (
                <div>
                    <GoogleLogin onSuccess={handleSuccess} onError={errorMessage} />
                    <Button onClick={initiateGitHubLogin} variant="contained" color="primary">
                        Login with GitHub
                    </Button>
                </div>
            )}
        </>
    );
};

export default Login;

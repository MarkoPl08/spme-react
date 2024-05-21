import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { loginUser } from '../../api.ts';
import { User } from '../../types/auth.ts';

interface EmailLoginComponentProps {
    setUser: (user: User) => void;
    user: User | null;
}

const EmailLoginComponent: React.FC<EmailLoginComponentProps> = ({ setUser, user }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await loginUser({ email, password });
        if (response.token && response.user) {
            console.log('Login successful, token stored');
            setUser({
                UserID: response.user.UserID,
                name: response.user.Username,
                familyName: '',
                Email: response.user.Email
            });
        } else {
            console.error('Login failed:', response.message);
        }
    };

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

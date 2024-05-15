import React, { useState } from 'react';
import { registerUser } from '../api.ts';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = 2;
    const packageId = 1;

    const handleRegister = async () => {
        const response = await registerUser({ username, email, password, role, packageId });
        if (response.user) {
            console.log('Registration successful:', response.user);
            // Handle successful registration (e.g., redirect to login page)
        } else {
            console.error('Registration failed:', response.message);
        }
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
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
            <Button onClick={handleRegister} variant="contained" color="primary">
                Register
            </Button>
        </Box>
    );
};

export default Register;

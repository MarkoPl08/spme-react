import React, { useState } from 'react';
import { registerUser } from '../../apis/authApi';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField.tsx';
import CustomButton from '../../components/CustomButton.tsx';

const EmailRegisterComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = 1;
    const packageId = 1;
    const navigate = useNavigate();

    const handleRegister = async () => {
        const response = await registerUser({ username, email, password, role, packageId });
        if (response.user) {
            console.log('Registration successful:', response.user);
            navigate('/login');
        } else {
            console.error('Registration failed:', response.message);
        }
    };

    return (
        <Box component="form" noValidate autoComplete="off">
            <CustomTextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
            />
            <CustomTextField
                label="Email"
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
            <CustomButton onClick={handleRegister} variant="contained">
                Register
            </CustomButton>
        </Box>
    );
};

export default EmailRegisterComponent;

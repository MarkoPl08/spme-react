// src/components/GoogleLoginComponent.tsx

import React, { useRef } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { User } from '../../types/auth';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton.tsx';

interface GoogleLoginComponentProps {
    setUser: (user: User | null) => void;
    user: User | null;
}

const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({ setUser, user }) => {
    const navigate = useNavigate();
    const googleButtonRef = useRef<HTMLDivElement>(null);

    const handleSuccess = (response: CredentialResponse) => {
        fetch('http://localhost:3001/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: response.credential })
        }).then(res => res.json())
            .then(data => {
                if (data.user) {
                    localStorage.setItem('jwtToken', data.token);
                    setUser({
                        UserID: data.user.UserID,
                        name: data.user.Username,
                        Email: data.user.Email
                    });
                    navigate('/dashboard');
                }
            })
            .catch(error => {
                console.error('Error during Google auth:', error);
            });
    };

    const errorMessage = () => {
        console.log('OAuth error occurred');
    };

    const handleCustomButtonClick = () => {
        if (googleButtonRef.current) {
            googleButtonRef.current.querySelector('button')?.click();
        }
    };

    return (
        <>
            {!user && (
                <>
                    <div ref={googleButtonRef} style={{ display: 'none' }}>
                        <GoogleLogin onSuccess={handleSuccess} onError={errorMessage} />
                    </div>
                    <CustomButton onClick={handleCustomButtonClick} variant="contained">
                        Login with Google
                    </CustomButton>
                </>
            )}
        </>
    );
};

export default GoogleLoginComponent;

import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { User } from '../../types/auth.ts';

interface GoogleLoginComponentProps {
    setUser: (user: User | null) => void;
    handleLogout: () => void;
    user: User | null;
}

const GoogleLoginComponent: React.FC<GoogleLoginComponentProps> = ({ setUser, user }) => {
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
                    localStorage.setItem('jwtToken', data.token);
                    setUser({
                        UserID: data.user.UserID,
                        name: data.user.Username,
                        Email: data.user.Email
                    });
                }
            })
            .catch(error => {
                console.error('Error during Google auth:', error);
            });
    };

    const errorMessage = () => {
        console.log('OAuth error occurred');
    };

    return (
        <>
            {!user && (
                <GoogleLogin onSuccess={handleSuccess} onError={errorMessage} />
            )}
        </>
    );
};

export default GoogleLoginComponent;

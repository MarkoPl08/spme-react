import React from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');

    React.useEffect(() => {
        if (token) {
            verifyToken(token).then(data => {
                if (!data.isValid) {
                    localStorage.removeItem('jwtToken');
                    navigate('/register');
                }
            }).catch(() => {
                localStorage.removeItem('jwtToken');
                navigate('/register');
            });
        } else {
            navigate('/register');
        }
    }, [navigate, token]);

    return <>{children}</>;
};

export default AuthWrapper;

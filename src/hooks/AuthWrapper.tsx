import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');

    React.useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    return <>{children}</>;
};

export default AuthWrapper;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../apis/authApi.ts';

const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            verifyToken(token).then(data => {
                if (!data.isValid) {
                    localStorage.removeItem('jwtToken');
                    navigate('/register');
                } else {
                    navigate('/dashboard');
                }
            }).catch(() => {
                localStorage.removeItem('jwtToken');
                navigate('/register');
            });
        } else {
            navigate('/register');
        }
    }, [navigate]);

    return null;
};

export default useAuthCheck;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api.ts';

const useAuthCheck = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            verifyToken(token).then(data => {
                if (!data.isValid) {
                    localStorage.removeItem('jwtToken');
                    navigate('/');
                } else {
                    navigate('/home');
                }
            }).catch(() => {
                localStorage.removeItem('jwtToken');
                navigate('/');
            });
        } else {
            navigate('/');
        }
    }, [navigate]);

    return null;
};

export default useAuthCheck;

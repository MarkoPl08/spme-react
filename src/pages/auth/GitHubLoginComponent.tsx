import React, { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../../types/auth';
import CustomButton from '../../components/CustomButton.tsx';

interface GitHubLoginComponentProps {
    setUser: (user: User | null) => void;
    user: User | null;
}

const GitHubLoginComponent: React.FC<GitHubLoginComponentProps> = ({ setUser, user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const initiateGitHubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = 'http://localhost:5173/login';
        const scope = 'user';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

        console.log('Redirecting to GitHub:', githubAuthUrl);
        window.location.href = githubAuthUrl;
    };

    const handleGitHubLogin = useCallback(async (code: string) => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            if (data.user) {
                localStorage.setItem('jwtToken', data.token);
                console.log('Login successful:', data.user);
                setUser({
                    UserID: data.user.UserID,
                    name: data.user.Username,
                    Email: data.user.Email,
                });
                navigate('/dashboard');
            } else {
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error during GitHub auth:', error);
        }
    }, [navigate, setUser]);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            console.log('Received GitHub code:', code);
            handleGitHubLogin(code);
        }
    }, [location, handleGitHubLogin]);

    return (
        <>
            {!user && (
                <CustomButton onClick={initiateGitHubLogin} variant="contained">
                    Login with GitHub
                </CustomButton>
            )}
        </>
    );
};

export default GitHubLoginComponent;

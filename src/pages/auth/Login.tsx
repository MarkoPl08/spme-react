import React, { useState } from 'react';
import GoogleLoginComponent from './GoogleLoginComponent';
import GitHubLoginComponent from './GitHubLoginComponent';
import EmailRegisterComponent from './EmailRegisterComponent';
import { User } from '../../types/auth';
import { useNavigate } from 'react-router-dom';

const MainLoginComponent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    return (
        <div>
            <>
                <EmailRegisterComponent />
                <GoogleLoginComponent setUser={setUser} user={user} />
                <GitHubLoginComponent setUser={setUser} user={user} />
                <p>
                    Already have an account?{' '}
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>
            </>
        </div>
    );
};

export default MainLoginComponent;

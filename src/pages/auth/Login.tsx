import React, { useState } from 'react';
import GoogleLoginComponent from './GoogleLoginComponent';
import GitHubLoginComponent from './GitHubLoginComponent';
import EmailLoginComponent from './EmailLoginComponent';
import { User } from '../../types/auth.ts';

const MainLoginComponent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    return (
        <div>
            <EmailLoginComponent setUser={setUser} user={user} />
            <GoogleLoginComponent setUser={setUser} handleLogout={handleLogout} user={user} />
            <GitHubLoginComponent setUser={setUser} user={user} />
            {user && (
                <div>
                    <h1>Welcome, {user.name}!</h1>
                    <p>Email: {user.Email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default MainLoginComponent;

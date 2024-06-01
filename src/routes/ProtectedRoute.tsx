import React from 'react';
import { Navigate } from 'react-router-dom';
import { parseJwt } from "../helpers/parseJwt";

interface ProtectedRouteProps {
    children: React.ReactElement;
    requiredRole?: number;
}

interface DecodedToken {
    userId: number;
    email: string;
    role: number;
    exp: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        console.log("No token found, redirecting to register.");
        return <Navigate to="/register" replace />;
    }

    try {
        const decodedToken: DecodedToken = parseJwt(token);
        console.log("Decoded token:", decodedToken);

        if (requiredRole !== undefined && decodedToken.role !== requiredRole) {
            console.log(`Role mismatch: required ${requiredRole}, found ${decodedToken.role}. Redirecting to dashboard.`);
            return <Navigate to="/dashboard" replace />;
        }

        return children;
    } catch (error) {
        console.error("Error decoding token:", error);
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;

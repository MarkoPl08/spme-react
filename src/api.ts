import {LoginCredentials, RegisterData, UserResponse} from "./types/auth.ts";

const BASE_URL = 'http://localhost:3000';

export async function loginUser(credentials: LoginCredentials): Promise<UserResponse> {
    return fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    }).then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
            }
            return data;
        });
}

export async function registerUser(data: RegisterData): Promise<UserResponse> {
    return fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => response.json());
}

export const verifyToken = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/verifyToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });

        const data = await response.json();
        return { isValid: data.isValid };
    } catch (error) {
        console.error('Error verifying token:', error);
        return { isValid: false };
    }
};

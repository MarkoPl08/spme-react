import {LoginCredentials, RegisterData, UserResponse} from "./types/auth.ts";

const BASE_URL = 'http://localhost:3000';

export async function loginUser(credentials: LoginCredentials): Promise<UserResponse> {
    return fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    }).then(response => response.json());
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

export async function loginWithGoogle(): Promise<UserResponse> {
    return fetch(`${BASE_URL}/auth/google`, {
        method: 'GET'
    }).then(response => response.json());
}

export async function loginWithGitHub(): Promise<UserResponse> {
    return fetch(`${BASE_URL}/auth/github`, {
        method: 'GET'
    }).then(response => response.json());
}

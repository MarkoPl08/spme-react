export interface LoginCredentials {
    email: string;
    password: string;
}

interface User {
    UserID: number;
    Username: string;
    Email: string;
    PasswordHash?: string;
    RoleID: number;
    PackageID: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface UserResponse {
    user?: User;
    message?: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: number;
    packageId: number;
}

export interface GoogleLoginResponse {
    credential: string;
    clientId: string;
    select_by: string;
}

export interface GoogleLoginError {
    error: string;
    details: string;
}
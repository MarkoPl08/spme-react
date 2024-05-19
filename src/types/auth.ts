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
    token?: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: number;
    packageId: number;
}

export interface VerifyTokenResponse {
    isValid: boolean;
    message: string;
    userId?: number;
}
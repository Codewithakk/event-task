export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
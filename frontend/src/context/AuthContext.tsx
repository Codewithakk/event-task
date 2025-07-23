import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/api';
import { User, AuthResponse, RegisterFormValues, LoginFormValues } from '../types/user';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (values: LoginFormValues) => Promise<void>;
    register: (values: RegisterFormValues) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await getProfile();
                    setUser(response.data);
                }
            } catch (err) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (values: LoginFormValues) => {
        const response = await apiLogin(values);
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
    };

    const register = async (values: RegisterFormValues) => {
        const response = await apiRegister({
            name: values.name,
            email: values.email,
            password: values.password,
        });
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
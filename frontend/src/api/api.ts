import axios from 'axios';

const API_URL = 'http://localhost:3000';
const token = localStorage.getItem('token'); // 👈 get stored JWT
console.log('API URL:', token);
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data: { email: string; password: string; name: string }) => {
    return api.post('/auth/register', data);
};

export const login = (data: { email: string; password: string }) => {
    return api.post('/auth/login', data);
};

export const getProfile = () => {
    return api.get('/users/profile');
};

export const createEvent = (data: FormData) => {
    return api.post('/events', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};


export const getEvents = (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
}) => {
    return api.get('/events', { params });
};

export const searchEvents = (keyword: string) => {
    return api.get('/events/search', { params: { keyword } });
};

export const getEvent = (id: number) => {
    return api.get(`/events/${id}`);
};

export const updateEvent = (id: number, data: FormData) => {
    return api.patch(`/events/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteEvent = (id: number) => {
    return api.delete(`/events/${id}`);
};

export default api;
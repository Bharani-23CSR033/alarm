import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const register = async (email, password) => {
    try {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/user');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default api;
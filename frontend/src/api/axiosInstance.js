import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const parsed = JSON.parse(user);
        if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
        }
    }
    return config;
});

// Global response error handler
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default API;

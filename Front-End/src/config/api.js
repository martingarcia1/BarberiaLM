import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const API_URL = import.meta.env.VITE_API_URL;

export default api;

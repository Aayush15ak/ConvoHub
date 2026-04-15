import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api', // use env variable or fallback to localhost
    withCredentials: true, // to send cookies with every request
})
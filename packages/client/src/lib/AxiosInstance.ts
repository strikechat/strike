import axios from 'axios';

export const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` || '',
    },
});

AxiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 403) {
            window.location.href = '/app';
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;

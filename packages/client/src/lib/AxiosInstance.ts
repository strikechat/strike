import axios from 'axios';

export const AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` || '',
    },
});

const IGNORED_UNAUTHORIZED_PAGES = ['/login', '/register', '/'];

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (IGNORED_UNAUTHORIZED_PAGES.includes(window.location.pathname))
            return Promise.reject(error);
        if (
            error.response &&
            (error.response.status === 403 || error.response.status === 401)
        ) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

export default AxiosInstance;

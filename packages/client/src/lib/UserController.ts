import { AxiosInstance } from './AxiosInstance';

export class UserController {
    static async login(username: string, password: string) {
        try {
            const res = await AxiosInstance.post('/auth/login', {
                username,
                password,
            });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/app';
        } catch (e) {
            console.log(e);
        }
    }

    static async register(username: string, email: string, password: string) {
        try {
            const res = await AxiosInstance.post('/auth/register', {
                username,
                email,
                password,
            });
            window.location.href = '/login';
        } catch (e) {
            console.log(e);
        }
    }

    static async me() {
        try {
            const res = await AxiosInstance.get('/auth/@me');
            localStorage.setItem('user-cache', JSON.stringify(res.data.user));
            return res.data.user;
        } catch (e) {
            console.log(e);
        }
    }

    static async getServers() {
        try {
            const res = await AxiosInstance.get('/server/@me');
            return res.data.servers;
        } catch (e) {
            console.log(e);
        }
    }

    static async getUserData(userId: string) {
        try {
            const res = await AxiosInstance.get(`/users/${userId}/profile`);
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }
}

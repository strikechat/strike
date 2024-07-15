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

    static async me() {
        try {
            const res = await AxiosInstance.get('/auth/@me');
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
}

import { AxiosInstance } from './AxiosInstance';

export class InviteController {
    public static async createInvite(serverId: string, maxUses: number, expiresAt: Date) {
        try {
            const res = await AxiosInstance.post(`/invite`, { serverId, maxUses, expiresAt });
            return res.data.invite.code;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public static async fetchInvite(code: string) {
        try {
            const res = await AxiosInstance.get(`/invite/${code}`);
            return res.data.invite;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public static async joinInvite(code: string) {
        try {
            const res = await AxiosInstance.put(`invite/${code}/accept`);
            return res.data.invite;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

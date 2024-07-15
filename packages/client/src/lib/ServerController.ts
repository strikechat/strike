import { AxiosInstance } from './AxiosInstance';

export class ServerController {
    static async getAllChannels(serverId: string) {
        try {
            const res = await AxiosInstance.get(`/server/${serverId}/channels`);
            return res.data.channels;
        } catch (e) {
            console.log(e);
        }
    }

    static async me(serverId: string) {
        try {
            const res = await AxiosInstance.get(`/server/${serverId}/@me`);
            return res.data.server;
        } catch (e) {
            console.log(e);
        }
    }
}

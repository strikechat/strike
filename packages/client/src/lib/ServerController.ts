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

    static async createChannel(serverId: string, name: string) {
        try {
            //TODO: Change type dynamically if there will be more
            const res = await AxiosInstance.post(
                `/server/${serverId}/channels`,
                { name, type: 0 },
            );
            return res.data.channel;
        } catch (e) {
            console.log(e);
        }
    }

    //TODO: Type
    static async updateChannel(serverId: string, channelId: string, data: any) {
        try {
            const res = await AxiosInstance.patch(
                `/server/${serverId}/channels/${channelId}`,
                data,
            );
            return res.data.channel;
        } catch (e) {
            console.log(e);
        }
    }
}

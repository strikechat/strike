import { AxiosInstance } from './AxiosInstance';

export class MessageController {
    static async fetchMessages(serverId: string, channelId: string, skip: number) {
        try {
            const res = await AxiosInstance.get(`/messages/${serverId}/${channelId}?skip=${skip}`);
            return res.data.messages;
        } catch (e) {
            console.log(e);
            return []
        }
    }

    static async sendMessage(content: string, serverId: string, channelId: string) {
        try {
            const res = await AxiosInstance.post(`/messages`, { content, serverId, channelId });
            return res.data.message;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    static async pinMessage(messageId: string) {
        try {
            const res = await AxiosInstance.put(`/messages/${messageId}/pin`);
            return res.data.message;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

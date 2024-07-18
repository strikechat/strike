import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { ServerController } from "../../lib/ServerController";
import { PlaceholderImage } from "../../lib/PlaceholderImage";
import { useTranslation } from "react-i18next";
import { useServer } from "../../lib/context/ServerContext";
import { FaCrown } from "react-icons/fa6";
import Tooltip from "../Tooltip";

const UserList = () => {
    const { serverId } = useParams();
    const [members, setMembers] = useState<any[]>([]);
    const [serverCache, setServerCache] = useState<any>({});
    const { t } = useTranslation();
    const { servers } = useServer();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await ServerController.getServerMembers(serverId!);
            setMembers(response);
            console.log(response);
        };
        fetchUsers();

        setServerCache(servers.find((server) => server._id === serverId));
    }, [serverId]);

    return (
        <div className="h-[calc(105vh-64px)] w-64 flex flex-col bg-background-secondary text-white p-2 mt-2 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">{t('app.user_list.title')}</h2>
            <div className="flex-grow overflow-y-auto">
                {members.map((member) => (
                    <div key={member._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-background-channel-hover hover:cursor-pointer relative">
                        <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(member.user.username))} className="w-8 h-8 rounded-full" />
                        <span className={`absolute bottom-1 left-7 w-3 h-3 ${member.user.status == 0 ? "bg-gray-500" : "bg-green-500"} rounded-full border-2 border-background-secondary`}></span>
                        <div className="flex flex-row items-center align-middle gap-2">
                            <span className="font-bold">{member.user.username}</span>
                            {serverCache.owner === member.user._id ? <Tooltip content={t('app.user_list.server_owner')} position="bottom"><FaCrown className="text-yellow-400" /></Tooltip> : null}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;

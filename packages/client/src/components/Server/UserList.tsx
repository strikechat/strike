import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ServerController } from "../../lib/ServerController";
import { PlaceholderImage } from "../../lib/PlaceholderImage";
import { useTranslation } from "react-i18next";
import { useServer } from "../../lib/context/ServerContext";
import { FaCrown } from "react-icons/fa6";
import Tooltip from "../Tooltip";
import ContextMenu, { ContextMenuItem, ContextMenuSpacer } from "../ContextMenu";
import { useModal } from "../../lib/context/ModalContext";
import UserProfile from "../UserProfile";

const UserList = () => {
    const { serverId } = useParams();
    const [members, setMembers] = useState<any[]>([]);
    const [serverCache, setServerCache] = useState<any>({});
    const { t } = useTranslation();
    const { servers } = useServer();
    const { showModal, hideModal } = useModal();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await ServerController.getServerMembers(serverId!);
            setMembers(response);
            console.log(response);
        };
        fetchUsers();

        setServerCache(servers.find((server) => server._id === serverId));
    }, [serverId]);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        // temporary Xd
        alert('User ID copied to clipboard!');
    };

    const handleOpenProfile = (member: any) => {
        showModal(<UserProfile user={member} />);
    };

    return (
        <div className="h-[calc(105vh-64px)] w-64 flex flex-col bg-background-secondary text-white p-2 mt-2 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">{t('app.user_list.title')}</h2>
            <div className="flex-grow overflow-y-auto">
                {members.map((member) => (
                    <ContextMenu menuItems={[
                        <ContextMenuItem onClick={() => handleOpenProfile(member.user)}>View Profile</ContextMenuItem>,
                        // <ContextMenuItem onClick={() => console.log('Send Message')}>Send Message</ContextMenuItem>,
                        // <ContextMenuItem onClick={() => console.log('Add Friend')}>Add Friend</ContextMenuItem>,
                        <ContextMenuSpacer />,
                        <ContextMenuItem onClick={() => console.log('Manage Roles')}>Manage Roles</ContextMenuItem>,
                        <ContextMenuItem onClick={() => console.log('Mute User')}><span className="text-red-500">Mute {member.user.username}</span></ContextMenuItem>,
                        <ContextMenuItem onClick={() => console.log('Kick User')}><span className="text-red-500">Kick {member.user.username}</span></ContextMenuItem>,
                        <ContextMenuItem onClick={() => console.log('Ban User')}><span className="text-red-500">Ban {member.user.username}</span></ContextMenuItem>,
                        <ContextMenuSpacer />,
                        <ContextMenuItem onClick={() => handleCopyId(member.user._id)}>Copy ID</ContextMenuItem>,
                        // <ContextMenuItem onClick={() => console.log('Block')}>Block {member.user.username}</ContextMenuItem>
                    ]}>

                        <div key={member._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-background-channel-hover hover:cursor-pointer relative">
                            <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(member.user.username))} className="w-8 h-8 rounded-full" />
                            <span className={`absolute bottom-1 left-7 w-3 h-3 ${member.user.status == 0 ? "bg-gray-500" : "bg-green-500"} rounded-full border-2 border-background-secondary`}></span>
                            <div className="flex flex-row items-center align-middle gap-2">
                                <span className="font-bold">{member.user.username}</span>
                                {serverCache.owner === member.user._id ? <Tooltip content={t('app.user_list.server_owner')} position="bottom"><FaCrown className="text-yellow-400" /></Tooltip> : null}
                            </div>
                        </div>
                    </ContextMenu>
                ))}
            </div>
        </div >
    );
};

export default UserList;

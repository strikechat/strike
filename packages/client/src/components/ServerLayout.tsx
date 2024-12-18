import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { ServerController } from "../lib/ServerController";
import { ChannelTypeIcons } from "../lib/utils/ChannelTypeIcons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaChevronDown, FaCog, FaDoorOpen, FaRegTrashAlt } from "react-icons/fa";
import { useCachedUser } from "../lib/hooks/useCachedUser";
import { MdOutlineChangeCircle, MdOutlineTopic, MdSettings, MdWavingHand } from "react-icons/md";
import { FaBoltLightning, FaHashtag } from "react-icons/fa6";
import Tooltip from "./Tooltip";
import { PlaceholderImage } from "../lib/PlaceholderImage";
import { useModal } from "../lib/context/ModalContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ContextMenu, { ContextMenuItem } from "./ContextMenu";
import { useSocket } from "../lib/context/SocketContext";
import { InviteController } from "../lib/InviteController";
import Divider from "./Divider.tsx";
import { UserBox } from "./Users/UserBox.tsx";
import UserList from "./Server/UserList.tsx";
import { useServer } from "../lib/context/ServerContext.tsx";

const ServerMenu = ({ serverName, isOwner, isOfficialServer }: { serverName: string; isOwner: boolean, isOfficialServer: boolean }) => {
    const { showModal, hideModal } = useModal();
    const { t } = useTranslation();
    const { serverId } = useParams();
    const {fetchServers} = useServer();

    const showCreateInviteModal = async () => {
        const date = new Date(new Date().setDate(new Date().getHours() + 24));
        const code = await InviteController.createInvite(serverId!, 1000, date);

        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.create_invite.invite')}</h1>
                <p className="text-gray-500 mb-4 text-sm">{t('app.create_invite.description')}</p>
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        value={`https://strike.gg/invite/${code}`}
                        readOnly
                    />
                    <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm rounded-lg px-4 py-2" onClick={() => navigator.clipboard.writeText(`https://strike.gg/invite/${code}`)}>Skopiuj</button>
                </div>
            </>
        )
    }

    const showCreateChannelModal = async () => {
        let channelName = '';
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.create_channel.title')}</h1>
                <p className="text-gray-500 mb-4 text-sm">{t('app.create_channel.description')}</p>
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('app.create_channel.placeholder')}
                        onChange={(e) => (channelName = e.target.value)}
                    />
                </div>
            </>,
            () => {
                ServerController.createChannel(serverId!, channelName).then((res) => {
                    hideModal();
                    window.location.href = `/server/${serverId}/channel/${res.data?.channel?._id}`
                    toast(t('app.create_channel.success'), { icon: '🎉' })
                })
            },
            () => {
                channelName = '';
                hideModal();
            }
        )
    }

    const redirectToSettings = async () => {
        window.location.href = `/server/${serverId}/settings`;
    };

    const showDeleteServerModal = async () => {
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.delete_server.title')}</h1>
                <p className="text-gray-500 text-sm">{t('app.delete_server.description', { serverName: serverName })}</p>
                <i className="text-red-500 mb-4">{t('app.delete_server.note')}</i>
                <center>
                    <button
                        className="bg-red-500 text-white text-sm rounded-lg px-4 py-2 mt-4 w-full"
                        onClick={() => {
                            ServerController.deleteServer(serverId!);
                            hideModal();
                            fetchServers();
                            window.location.href = '/app';
                        }}
                    >
                        {t('app.delete_server.delete')}
                    </button>
                </center>
            </>
        );
    }


    return (
        <Menu as="div" className="py-4 px-2 bg-background-secondary rounded-lg">
            <MenuButton className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                    {isOfficialServer && (
                        <Tooltip content={t('app.server_header.badges.official_server')}>
                            <span className="bg-gradient-to-tr from-gray-600 to-gray-700 flex items-center justify-center h-8 w-8 rounded-full text-sm text-yellow-300">
                                <FaBoltLightning />
                            </span>
                        </Tooltip>
                    )}
                    <span className="text-sm font-bold">{serverName}</span>
                </div>
                <FaChevronDown />
            </MenuButton>

            <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                <div className="py-1">
                    <MenuItem>
                        <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex flex-row items-center gap-2 w-full" onClick={showCreateInviteModal}>
                            <MdWavingHand /> {t('app.server_header.actions.create_invite')}
                        </button>
                    </MenuItem>
                    <hr className="border-gray-700" />
                    {isOwner && (
                        <>
                            <MenuItem>
                                <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2" onClick={redirectToSettings}>
                                    <MdSettings /> {t('app.server_header.actions.settings')}
                                </button>
                            </MenuItem>
                            <MenuItem>
                                <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2" onClick={showCreateChannelModal}>
                                    <FaHashtag /> {t('app.server_header.actions.create_channel')}
                                </button>
                            </MenuItem>

                        </>
                    )}
                    <hr className="border-gray-700" />
                    <MenuItem>
                        <button className="px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2" onClick={showDeleteServerModal}>
                            {isOwner ? <FaRegTrashAlt /> : <FaDoorOpen />}
                            {isOwner ? t('app.server_header.actions.delete_server') : t('app.server_header.actions.leave_server')}
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu >
    )
}

export const ServerLayout = () => {
    const { serverId, channelId } = useParams();
    const [channels, setChannels] = useState<any[]>([]);
    const [server, setServer] = useState<any>({});
    const cachedUser = useCachedUser();
    const { t } = useTranslation();
    const { showModal, hideModal } = useModal();

    const fetchData = async () => {
        setServer(await ServerController.me(serverId!));
        setChannels(await ServerController.getAllChannels(serverId!));
    };

    useEffect(() => {
        fetchData();
    }, [serverId]);


    const showEditTopicModal = () => {
        let topic = '';
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.edit_channel_topic.title')}</h1>
                <p className="text-gray-500 mb-4 text-sm">{t('app.edit_channel_topic.description')}</p>
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('app.edit_channel_topic.placeholder')}
                        onChange={(e) => (topic = e.target.value)}
                    />
                </div>
            </>,
            async () => {
                try {
                    await ServerController.updateChannel(serverId!, channelId!, { topic });
                    await fetchData();
                    toast(t('app.edit_channel_topic.success'), { icon: '🎉' });

                    window.location.href = `/server/${serverId}/channel/${channelId}`;
                    hideModal();
                } catch {
                    toast(t('app.edit_channel_topic.error'), { icon: '🙁' });
                }
            }
        );
    };

    const showEditChannelNameModal = () => {
        let name = '';
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.edit_channel_name.title')}</h1>
                <p className="text-gray-500 mb-4 text-sm">{t('app.edit_channel_name.description')}</p>
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('app.edit_channel_name.placeholder')}
                        onChange={(e) => (name = e.target.value)}
                    />
                </div>
            </>,
            async () => {
                try {
                    await ServerController.updateChannel(serverId!, channelId!, { name });
                    fetchData();
                    toast(t('app.edit_channel_name.success'), { icon: '🎉' });

                    window.location.href = `/server/${serverId}/channel/${channelId}`;
                    hideModal();
                } catch {
                    toast(t('app.edit_channel_name.error'), { icon: '🙁' });
                }
            }
        );
    };

    return (
        server.name && (
            <div className="flex h-screen">
                <div className="flex flex-col">
                    <div className="sidebar bg-background-secondary text-white h-full w-64 rounded-2xl p-1 mt-2">
                        <ServerMenu serverName={server.name} isOwner={cachedUser?._id === server.owner} isOfficialServer={server.features?.includes("OfficialServer")} />
                        <Divider />
                        {channels?.map((channel) => (
                            <div key={channel._id} className={`block py-2 px-4 hover:bg-background-channel-hover ${channel._id === channelId ? "bg-background-channel-hover" : ""} rounded-2xl`}>
                                <ContextMenu menuItems={
                                    [
                                        <>
                                            <ContextMenuItem key={"edit_topic"} onClick={showEditChannelNameModal}>
                                                <MdOutlineChangeCircle /> {t('app.edit_channel_name.title')}
                                            </ContextMenuItem>
                                            <ContextMenuItem key={"edit_topic"} onClick={showEditTopicModal}>
                                                <MdOutlineTopic /> {t('app.edit_channel_topic.title')}
                                            </ContextMenuItem>

                                        </>
                                    ]
                                }>
                                    <Link
                                        key={channel._id}
                                        to={`/server/${serverId}/channel/${channel._id}`}
                                        className="flex flex-row items-center gap-2 "

                                    >
                                        {ChannelTypeIcons[channel.type as keyof typeof ChannelTypeIcons]} {channel.name}
                                    </Link>
                                </ContextMenu>
                            </div>
                        ))}
                    </div>
                    <UserBox />
                </div>
                <div className="flex-grow bg-background-primary text-white p-2">
                    <Outlet />
                </div>
                <UserList />
            </div>
        )
    );
};

export default ServerLayout;

import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { ServerController } from "../lib/ServerController";
import { ChannelTypeIcons } from "../lib/utils/ChannelTypeIcons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaChevronDown, FaCog, FaDoorOpen, FaRegTrashAlt } from "react-icons/fa";
import { useCachedUser } from "../lib/hooks/useCachedUser";
import { MdOutlineTopic, MdWavingHand } from "react-icons/md";
import { FaBoltLightning, FaHashtag } from "react-icons/fa6";
import Tooltip from "./Tooltip";
import { PlaceholderImage } from "../lib/PlaceholderImage";
import { useModal } from "../lib/context/ModalContext";
import { useTranslation } from "react-i18next";
import { InviteController } from "../lib/InviteController";
import toast from "react-hot-toast";
import ContextMenu, { ContextMenuItem } from "./ContextMenu";

const ServerMenu = ({ serverName, isOwner, isOfficialServer }: { serverName: string; isOwner: boolean, isOfficialServer: boolean }) => {
    const { showModal, hideModal } = useModal();
    const { t } = useTranslation();
    const { serverId } = useParams();
    const [createChannelName, setCreateChannelName] = useState('');

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
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-2">{t('app.create_channel.title')}</h1>
                <p className="text-gray-500 mb-4 text-sm">{t('app.create_channel.description')}</p>
                <div className="relative">
                    <input
                        type="text"
                        className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5 pr-16 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('app.create_channel.placeholder')}
                        onChange={(e) => setCreateChannelName(e.target.value)}
                    />
                </div>
            </>,
            () => {
                ServerController.createChannel(serverId!, createChannelName).then((res) => {
                    hideModal();
                    window.location.href = `/server/${serverId}/channel/${res.data?.channel?._id}`
                    toast(t('app.create_channel.success'), { icon: '🎉' })
                })
            },
            () => {
                setCreateChannelName('');
                hideModal();
            }
        )
    }

    return (
        <Menu as="div" className="py-4 px-2 bg-gradient-to-bl from-gray-800 to-gray-900">
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
                        <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex flex-row items-center gap-2 w-full" onClick={showCreateInviteModal}>
                            <MdWavingHand /> {t('app.server_header.actions.create_invite')}
                        </button>
                    </MenuItem>
                    <hr className="border-gray-700" />
                    {isOwner && (
                        <MenuItem>
                            <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2" onClick={showCreateChannelModal}>
                                <FaHashtag /> {t('app.server_header.actions.create_channel')}
                            </button>
                        </MenuItem>
                    )}
                    <hr className="border-gray-700" />
                    <MenuItem>
                        <button className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2">
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
                    fetchData();
                    toast(t('app.edit_channel_topic.success'), { icon: '🎉' });
                    
                    window.location.href = `/server/${serverId}/channel/${channelId}`;
                    hideModal();
                } catch {
                    toast(t('app.edit_channel_topic.error'), { icon: '🙁' });
                }
            }
        );
    };



    return (
        server.name && (
            <div className="flex h-screen">
                <div className="sidebar bg-gray-700 text-white h-full w-64">
                    <ServerMenu serverName={server.name} isOwner={cachedUser?._id === server.owner} isOfficialServer={server.features?.includes("OfficialServer")} />
                    {channels?.map((channel) => (
                        <div className={`block py-2 px-4 hover:bg-gray-800 ${channel._id === channelId ? "bg-black/30" : ""}`}>
                            <ContextMenu menuItems={
                                [
                                    <ContextMenuItem key={"edit_topic"} onClick={showEditTopicModal}>
                                        <MdOutlineTopic /> {t('app.edit_channel_topic.title')}
                                    </ContextMenuItem>
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
                    <div className="bg-gradient-to-bl from-gray-800 to-gray-900 text-white w-64 h-[7vh] bottom-0 fixed">
                        <div className="px-3 flex items-center justify-between h-full">
                            <div className="flex items-center gap-2">
                                <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(cachedUser.username))} className="w-10 h-10 rounded-full" />
                                <span className="font-bold">
                                    {cachedUser.username}
                                </span>
                            </div>
                            <div className="text-xl text-gray-300">
                                <Tooltip content={t('app.user_box.open_settings')} position="top">
                                    <FaCog />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-grow bg-gray-800 text-white">
                    <Outlet />
                </div>
            </div>
        )
    );
};

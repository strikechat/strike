import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { ServerController } from "../lib/ServerController";
import { ChannelTypeIcons } from "../lib/utils/ChannelTypeIcons";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaChevronDown, FaCog, FaDoorOpen, FaRegTrashAlt } from "react-icons/fa";
import { useCachedUser } from "../lib/hooks/useCachedUser";
import { MdWavingHand } from "react-icons/md";
import { FaBoltLightning } from "react-icons/fa6";
import Tooltip from "./Tooltip";
import { PlaceholderImage } from "../lib/PlaceholderImage";
import { useModal } from "../lib/context/ModalContext";

const ServerMenu = ({ serverName, isOwner, isOfficialServer }: { serverName: string; isOwner: boolean, isOfficialServer: boolean }) => {
    const { showModal } = useModal();

    const test = () => {
        showModal((<>Test</>))
    }

    return (
        <Menu as="div" className="py-4 px-2 bg-gradient-to-bl from-gray-800 to-gray-900">
            <MenuButton className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                    {isOfficialServer && (
                        <Tooltip content="Official Server">
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
                        <button className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex flex-row items-center gap-2 w-full" onClick={test}>
                            <MdWavingHand /> Create invite
                        </button>
                    </MenuItem>
                    <hr className="border-gray-700" />
                    <MenuItem>
                        <button className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-white w-full flex flex-row items-center gap-2">
                            {isOwner ? <FaRegTrashAlt /> : <FaDoorOpen />}
                            {isOwner ? "Delete server" : "Leave server"}
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu >
    )
}

export const ServerLayout = () => {
    const { serverId } = useParams();
    const [channels, setChannels] = useState<any[]>([]);
    const [server, setServer] = useState<any>({});
    const cachedUser = useCachedUser();

    useEffect(() => {
        const fetchData = async () => {
            setServer(await ServerController.me(serverId!));
            setChannels(await ServerController.getAllChannels(serverId!));
        };
        fetchData();
    }, [serverId]);

    return (
        server.name && (
            <div className="flex h-screen">
                <div className="sidebar bg-gray-700 text-white h-full w-64">
                    <ServerMenu serverName={server.name} isOwner={cachedUser?._id === server.owner} isOfficialServer={server.features?.includes("OfficialServer")} />
                    {channels?.map((channel) => (
                        <Link
                            key={channel._id}
                            to={`/server/${serverId}/channel/${channel._id}`}
                            className="block py-2 px-4 hover:bg-gray-800 flex flex-row items-center gap-2"
                        >
                            {ChannelTypeIcons[channel.type as keyof typeof ChannelTypeIcons]} {channel.name}
                        </Link>
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
                                <Tooltip content="Open settings" position="top">
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

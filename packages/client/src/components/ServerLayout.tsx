import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom"
import { ServerController } from "../lib/ServerController";
import { ChannelTypeIcons } from "../lib/utils/ChannelTypeIcons";

export const ServerLayout = () => {
    const { serverId } = useParams();
    const [channels, setChannels] = useState<any[]>([]);
    const [server, setServer] = useState<any>({});

    const getAllChannels = async () => {
        setChannels(await ServerController.getAllChannels(serverId!));
    }

    const fetchServer = async () => {
        setServer(await ServerController.me(serverId!));
    }

    useEffect(() => {
        fetchServer();
        getAllChannels();
    }, [serverId])

    return (
        <>
            {server.name && (
                <div className="flex h-screen">
                    <div className="sidebar bg-gray-700 text-white h-full w-64">
                        <div className="p-5 bg-gray-800 text-center">
                            <h1 className="text-md font-bold">{server.name}</h1>
                        </div>
                        {channels.map((channel) => (
                            <Link to={`/server/${serverId}/channel/${channel._id}`} className="block py-2 px-4 hover:bg-gray-800 flex flex-row items-center gap-2">{ChannelTypeIcons[channel.type as keyof typeof ChannelTypeIcons]} {channel.name}</Link>
                        ))}
                    </div>
                    <div className="flex-grow bg-gray-800 text-white">
                        <Outlet />
                    </div>
                </div>
            )}
        </>
    )
}
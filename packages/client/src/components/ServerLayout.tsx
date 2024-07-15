import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom"
import { ServerController } from "../lib/ServerController";

export const ServerLayout = () => {
    const { serverId } = useParams();
    const [channels, setChannels] = useState<any[]>([]);

    const getAllChannels = async () => {
        setChannels(await ServerController.getAllChannels(serverId!));
    }

    useEffect(() => {
        getAllChannels();
    }, [serverId])

    return (
        <div className="flex h-screen">
            <div className="sidebar bg-gray-700 text-white h-full w-32">
                {channels.map((channel) => (
                    <Link to={`/server/${serverId}/channel/${channel._id}`} className="block py-2 px-4 hover:bg-gray-800">{channel.name}</Link>
                ))}
            </div>
            <div className="flex-grow bg-gray-800 text-white">
                <Outlet />
            </div>
        </div>
    )
}
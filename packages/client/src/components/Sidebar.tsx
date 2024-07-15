import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserController } from '../lib/UserController';

const Sidebar = () => {
    const [servers, setServers] = React.useState<any[]>([]);

    const fetchServers = async () => {
        setServers(await UserController.getServers());
    }

    useEffect(() => {
        fetchServers();
    }, [])

    return (
        <div className="sidebar bg-gray-900 text-white h-full w-32">
            {servers.map((server) => (
                <Link to={`/server/${server._id}`} className="block py-2 px-4 hover:bg-gray-800">{server.name}</Link>
            ))}
        </div>
    );
};

export default Sidebar;

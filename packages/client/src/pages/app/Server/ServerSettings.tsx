import React, { useEffect } from 'react';
import { FaCog, FaUsers } from 'react-icons/fa';
import { useState } from 'react';
import { useServer } from '../../../lib/context/ServerContext';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa6';
import { Roles } from './ServerSettingsPages/Roles';

export const ServerSettings = () => {
    const [server, setServer] = useState<any>({});
    const { serverId } = useParams<{ serverId: string }>();
    const { fetchServers, servers } = useServer();
    const { t } = useTranslation();

    useEffect(() => {
        fetchServers();
        setServer(servers.find((server) => server._id.toString() === serverId));
    }, [serverId])

    return (
        <div className="h-screen w-full bg-background-primary text-white flex items-center justify-center">
            <div className="flex h-4/5 w-3/4 bg-background-primary box-border rounded-2xl overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-background-secondary p-4 flex flex-col rounded-2xl h-full">
                    <div className="flex items-center mb-6">
                        <span className="text-2xl font-bold ml-2">{server?.name}</span>
                    </div>
                    <nav className="flex-1">
                        <ul>
                            <li className="mb-4">
                                <a href="#" className="flex items-center p-2 rounded-lg hover:bg-background-secondary-hover">
                                    <FaCog className="mr-2" />
                                    <span>{t('app.server_settings.overview')}</span>
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="#" className="flex items-center p-2 rounded-lg hover:bg-background-secondary-hover">
                                    <FaUsers className="mr-2" />
                                    <span>{t('app.server_settings.ranks')}</span>
                                </a>
                            </li>
                            <hr className="border-background-primary" />
                            <li className="mb-4">
                                <a href="#" className="flex items-center p-2 rounded-lg text-red-500 hover:bg-background-secondary-hover">
                                    <FaTrash className="mr-2" />
                                    <span>{t('app.server_settings.delete_server')}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                {/* Content */}
                <div className="flex-1 px-2 box-border h-full overflow-y-auto">
                    {/* <Outlet/> */}
                    <Roles />
                </div>
            </div>
        </div>
    );
};

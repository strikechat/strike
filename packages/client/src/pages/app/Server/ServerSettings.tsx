import React, { useEffect } from 'react';
import { FaDiscord, FaCog, FaUsers, FaSmile, FaMusic } from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { useServer } from '../../../lib/context/ServerContext';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa6';

export const ServerSettings = () => {
    const [server, setServer] = useState<any>({});
    const { serverId } = useParams<{ serverId: string }>();
    const { fetchServers, servers } = useServer();
    const { t } = useTranslation();

    useEffect(() => {
        fetchServers();

        setServer(servers.find((server) => server._id === serverId));
    }, [serverId])

    return (
        <div className="flex h-screen bg-background-primary text-white">
            {/* Sidebar */}
            <div className="w-64 bg-background-secondary p-4 flex flex-col m-2 rounded-2xl">
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
            <div className="flex-1 p-2">
                <div className="bg-background-secondary p-6 rounded-lg">
                    <h1 className="text-2xl font-bold mb-4">Overview</h1>
                    <div className="mb-4">
                        <label className="block text-gray-500">INACTIVE CHANNEL</label>
                        <select className="w-full bg-gray-700 rounded-lg p-2 mt-1">
                            <option>No Inactive Channel</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-500">INACTIVE TIMEOUT</label>
                        <select className="w-full bg-gray-700 rounded-lg p-2 mt-1">
                            <option>5 minutes</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-500">SYSTEM MESSAGES CHANNEL</label>
                        <select className="w-full bg-gray-700 rounded-lg p-2 mt-1">
                            <option># ogólny</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <Switch.Group>
                            <div className="flex items-center justify-between">
                                <Switch.Label className="text-gray-500">Send a random welcome message when someone joins this server.</Switch.Label>
                                <Switch
                                    checked={true}
                                    onChange={() => { }}
                                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500"
                                >
                                    <span className="sr-only">Enable random welcome message</span>
                                    <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6" />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                    <div className="mb-4">
                        <Switch.Group>
                            <div className="flex items-center justify-between">
                                <Switch.Label className="text-gray-500">Prompt members to reply to welcome messages with a sticker.</Switch.Label>
                                <Switch
                                    checked={true}
                                    onChange={() => { }}
                                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500"
                                >
                                    <span className="sr-only">Enable reply with sticker</span>
                                    <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6" />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                    <div className="mb-4">
                        <Switch.Group>
                            <div className="flex items-center justify-between">
                                <Switch.Label className="text-gray-500">Send a message when someone boosts this server.</Switch.Label>
                                <Switch
                                    checked={true}
                                    onChange={() => { }}
                                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500"
                                >
                                    <span className="sr-only">Enable boost message</span>
                                    <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6" />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                    <div className="mb-4">
                        <Switch.Group>
                            <div className="flex items-center justify-between">
                                <Switch.Label className="text-gray-500">Send helpful tips for server setup.</Switch.Label>
                                <Switch
                                    checked={true}
                                    onChange={() => { }}
                                    className="relative inline-flex items-center h-6 rounded-full w-11 bg-green-500"
                                >
                                    <span className="sr-only">Enable server setup tips</span>
                                    <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6" />
                                </Switch>
                            </div>
                        </Switch.Group>
                    </div>
                </div>
            </div>
        </div>
    );
};

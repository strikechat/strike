import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlaceholderImage } from '../lib/PlaceholderImage';
import { FaLanguage, FaPlusCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';
import { useModal } from '../lib/context/ModalContext';
import { useTranslation } from 'react-i18next';
import { AxiosInstance } from '../lib/AxiosInstance';
import { useServer } from '../lib/context/ServerContext';
import { useSocket } from '../lib/context/SocketContext';
import { useCachedUser } from '../lib/hooks/useCachedUser';
import Avatar from "./Avatar.tsx";

const Sidebar = () => {
    const { servers, fetchServers } = useServer();
    const { showModal } = useModal();
    const { t } = useTranslation();
    const { socket, connect, isConnected } = useSocket();
    const user = useCachedUser();

    useEffect(() => {
        console.log('Fetching servers...');
        fetchServers();

        connect();

        socket?.on('connect', () => {
            console.log('Socket connected');
        })

        socket?.on('disconnect', () => {
            console.log('Socket disconnected');
        })

        return () => {
            socket?.off('connect');
            socket?.off('disconnect');
        }
    }, [socket]);

    const showCreateServerModal = () => {
        let serverName = '';
        showModal(
            <>
                <h1 className="text-2xl font-bold mb-4">{t('app.sidebar.create_new_server')}</h1>
                <label className="block mb-2 text-sm font-medium text-white">
                    {t('app.sidebar.server_name')}
                </label>
                <input
                    type="text"
                    className="bg-gray-800 border text-white text-sm rounded-lg block w-full p-2.5:bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My cool server"
                    required
                    onChange={(e) => (serverName = e.target.value)}
                />
            </>,
            () => {
                AxiosInstance.post('/server', { name: serverName })
                    .then((res) => {
                        fetchServers();
                        window.location.href = `/server/${res.data?.server?._id}/channel/${res.data?.channel?._id}`;
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                serverName = '';
            }
        );
    };

    return (
        <div className="sidebar text-white h-full w-25 flex flex-col bg-background-secondary rounded-3xl transition-all duration-300 ">
            {servers?.map((server) => (
                <Link
                    to={`/server/${server._id}`}
                    className="relative block py-2 px-4 group transition-all duration-300"
                    key={server._id}
                >
                    <Tooltip content={server.name} position="right">
                        <Avatar text={server.name} />
                    </Tooltip>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
            ))}
            <Tooltip content={t('app.sidebar.create_new_server')} position="right">
                <button
                    className="relative block py-2 px-4 group text-5xl text-center text-[#5c5a5b] transition-all duration-300"
                    onClick={showCreateServerModal}
                >
                    <FaPlusCircle />
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </Tooltip>
            {user.badges.includes("Staff") && (
                <Link to="/translations">
                    <Tooltip content={t('app.sidebar.translations')} position="right">
                        <button className="relative block py-2 px-4 group text-5xl text-center text-[#5c5a5b] transition-all duration-300">
                            <FaLanguage />
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </Tooltip>
                </Link>
            )}
        </div>
    );

};

export default Sidebar;

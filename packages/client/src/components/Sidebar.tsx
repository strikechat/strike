import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserController } from '../lib/UserController';
import { PlaceholderImage } from '../lib/PlaceholderImage';
import { FaPlusCircle } from 'react-icons/fa';
import Tooltip from './Tooltip';
import { useModal } from '../lib/context/ModalContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const [servers, setServers] = React.useState<any[]>([]);
    const [serverName, setServerName] = React.useState<string>('');
    const { showModal } = useModal();
    const { t } = useTranslation();

    const fetchServers = async () => {
        setServers(await UserController.getServers());
    }

    const showCreateServerModal = () => {
        showModal(<>
            <h1 className="text-2xl font-bold mb-4">{t('app.sidebar.create_server')}</h1>
            <label className="block mb-2 text-sm font-medium text-white">{t('app.sidebar.server_name')}</label>
            <input type="text" id="last_name" className="bg-gray-800 border text-white text-sm rounded-lg  block w-full p-2.5:bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="My cool server" required onChange={(e) => setServerName(e.target.value)} />
        </>, () => {

        })
    }

    useEffect(() => {
        fetchServers();
    }, [])

    return (
        <div className="sidebar bg-gray-900 text-white h-full w-25">
            {servers.map((server) => (
                <Link to={`/server/${server._id}`} className="block py-2 px-4 hover:bg-gray-800">
                    <img className='rounded-full' src={PlaceholderImage.getSrc(50, 50, PlaceholderImage.getFirstLetters(server.name))} />
                </Link>
            ))}
            <Tooltip content={t('app.sidebar.create_server')} position='right'>
                <button className="block py-2 px-4 hover:bg-gray-800 text-5xl text-center text-[#5c5a5b]" onClick={showCreateServerModal}>
                    <FaPlusCircle />
                </button>
            </Tooltip>
        </div>
    );
};

export default Sidebar;

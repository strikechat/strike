import React, { JSXElementConstructor, useEffect, useRef, useState } from 'react';
import { MessageController } from '../lib/MessageController';
import { useParams } from 'react-router-dom';
import { TbMessagePin } from 'react-icons/tb';
import { ChannelTypeIcons } from '../lib/utils/ChannelTypeIcons';
import { AxiosInstance } from '../lib/AxiosInstance';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaHammer, FaKeyboard, FaMapPin } from 'react-icons/fa6';
import ContextMenu, { ContextMenuItem } from './ContextMenu';
import { BsRobot } from 'react-icons/bs';
import Tooltip from './Tooltip';
import { InviteController } from '../lib/InviteController';
import { PlaceholderImage } from '../lib/PlaceholderImage';
import { Message } from './Message';
import { useSocket } from '../lib/context/SocketContext';

const INVITE_REGEX = /strike.gg\/invite\/([a-zA-Z0-9]{6,64})/;

export const ChannelView = () => {
    const { serverId, channelId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [channel, setChannel] = useState<any>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (!serverId || !channelId) return;

        const fetchChannel = async () => {
            try {
                const res = await AxiosInstance.get(`/server/${serverId}/channels/${channelId}`);
                setChannel(res.data.channel);
            } catch (error) { }
        }

        const fetchMessages = async () => {
            try {
                const newMessages = await MessageController.fetchMessages(serverId, channelId, 0);
                setMessages(newMessages);
            } catch (error) { }
        }

        fetchChannel();
        fetchMessages();

        socket?.on('MESSAGE_CREATE', handleMessageCreate);

        return () => {
            socket?.off('MESSAGE_CREATE', handleMessageCreate);
        };

    }, [serverId, channelId, socket]);

    const handleMessageCreate = (data: any) => {
        if(data.channel !== channelId) return;
        setMessages(prevMessages => [...prevMessages, data]);
        scrollToBottom();
    };


    const handleSendMessage = async (target: any) => {
        socket?.emit('MESSAGE_CREATE', { content: target.value, serverId, channelId });
        target.value = '';
        // const res = await MessageController.sendMessage(target.value, serverId!, channelId!);
        // if (res) {
            // setMessages([...messages, res]);
            // target.value = '';
            // scrollToBottom();
        // }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    if (!serverId || !channelId) return null;

    return (
        <div className="flex flex-col h-full bg-background-secondary text-white">
            <div className="relative flex justify-between items-center p-4 border-b border-gray-700">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">{ChannelTypeIcons[channel.type as keyof typeof ChannelTypeIcons]}</span>
                        <h1 className="text-xl font-bold">{channel.name}</h1>
                    </div>
                    <h2 className="text-gray-500">{(!channel.topic || channel.topic == '') ? "No topic set" : channel.topic}</h2>
                </div>
                <div className="relative group">
                    <a className="text-gray-500 cursor-pointer" href="#" id="pin-icon">
                        <TbMessagePin className="w-6 h-6" />
                    </a>
                    <div className="absolute right-0 mt-2 w-64 p-4 bg-gray-900 border border-gray-800 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-lg font-semibold mb-2">Pinned messages</h3>
                        <ul className="list-disc list-inside text-gray-300">
                            {messages.filter((message) => message.pinned).map((message) => (
                                <div className="p-4 rounded hover:bg-background-hoover" key={message._id}>
                                    <div className="flex flex-row gap-2">
                                        <img src="https://cdn.discordapp.com/avatars/937152156379803658/a_6246465bb3b30e1fcc787390f5d9db86.gif" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-bold">{message.author.username}</div>
                                            <div>{message.content}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-gray-400">No messages yet</h1>
                        <h2 className="text-xl text-gray-500">Be the first to send a message</h2>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const previousMessage = messages[index - 1];
                        const showDateDivider = !previousMessage || new Date(previousMessage.createdAt).toDateString() !== new Date(message.createdAt).toDateString();
                        const showAvatar = !previousMessage || previousMessage.author?._id !== message.author?._id || showDateDivider;

                        return (
                            <div key={message._id}>
                                {showDateDivider && (
                                    <div className="flex items-center my-4">
                                        <div className="flex-grow border-t border-gray-700"></div>
                                        <span className="mx-4 text-gray-600">{new Date(message.createdAt).toDateString()}</span>
                                        <div className="flex-grow border-t border-gray-700"></div>
                                    </div>
                                )}
                                {!message.isSystem ? (
                                    <ContextMenu menuItems={[
                                        <ContextMenuItem onClick={async () => { await MessageController.pinMessage(message._id) }}>
                                            <FaMapPin /> {message.pinned ? 'Unpin' : 'Pin'} message
                                        </ContextMenuItem>
                                    ]}>
                                        <div className="p-2 rounded hover:bg-background-secondary-hover w-full">
                                            <div className="flex flex-row gap-2">
                                                {showAvatar && (
                                                    <img src="https://cdn.discordapp.com/avatars/937152156379803658/a_6246465bb3b30e1fcc787390f5d9db86.gif" className="w-10 h-10 rounded-full" />
                                                )}
                                                <div className={`flex flex-col ${showAvatar ? '' : 'ml-12'}`}>
                                                    {showAvatar && (
                                                        <Menu as="div" className="font-bold hover:underline hover:cursor-pointer">
                                                            <MenuButton>{message.author.username}</MenuButton>
                                                            <MenuItems className="p-2 absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                                                                <MenuItem>
                                                                    <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-400 flex items-center gap-2 w-full" onClick={() => navigator.clipboard.writeText(message.author._id)}>
                                                                        <FaKeyboard /> Copy user ID
                                                                    </button>
                                                                </MenuItem>
                                                            </MenuItems>
                                                        </Menu>
                                                    )}
                                                    {/*<span className="text-gray-400 text-sm">{new Date(message.createdAt).toLocaleTimeString()}</span>*/}
                                                    <span>{message.content}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </ContextMenu>
                                ) : (
                                    <div className="flex justify-center">
                                        <Tooltip content="This is official system message" position='top'>
                                            <div className="flex gap-2 items-center p-2 bg-background-primary rounded-lg my-2">
                                                <BsRobot />
                                                <span className="text-sm text-gray-300">{message.content}</span>
                                            </div>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 bg-background-secondary p-4">
                <form className="flex gap-2" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="flex-grow p-2 rounded-lg bg-background-primary text-white placeholder-gray-400"
                        placeholder="Type your message here..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-xl p-2 hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

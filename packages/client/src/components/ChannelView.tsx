import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosInstance } from '../lib/AxiosInstance';
import { useSocket } from '../lib/context/SocketContext';
import { Message } from './Message';
import { FaMapPin } from 'react-icons/fa6';
import { TbMessagePin } from 'react-icons/tb';
import { PlaceholderImage } from '../lib/PlaceholderImage';
import { ChannelTypeIcons } from '../lib/utils/ChannelTypeIcons';
import { MessageController } from '../lib/MessageController';
import ContextMenu, { ContextMenuItem } from './ContextMenu';

const LIMIT = 20;

export const ChannelView = () => {
    const { serverId, channelId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [channel, setChannel] = useState<any>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState<string>('');
    const { socket } = useSocket();
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchMessages = async (initialLoad = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await AxiosInstance.get(`/messages/${serverId}/${channelId}`, {
                params: {
                    limit: LIMIT,
                    skip: initialLoad ? 0 : messages.length
                }
            });
            const newMessages = res.data.messages;
            if (initialLoad) {
                setMessages(newMessages.reverse());
                scrollToBottom();
            } else {
                const container = messagesContainerRef.current;
                const scrollHeightBefore = container?.scrollHeight || 0;
                setMessages([...newMessages.reverse(), ...messages]);
                setTimeout(() => {
                    const scrollHeightAfter = container?.scrollHeight || 0;
                    const scrollTop = (container?.scrollTop || 0) + (scrollHeightAfter - scrollHeightBefore);
                    if (container) container.scrollTop = scrollTop;
                }, 0);
            }
            setHasMore(newMessages.length === LIMIT);
        } catch (error) { }
        setLoading(false);
    };


    useEffect(() => {
        if (!serverId || !channelId) return;

        const fetchChannel = async () => {
            try {
                const res = await AxiosInstance.get(`/server/${serverId}/channels/${channelId}`);
                setChannel(res.data.channel);
            } catch (error) { }
        };

        fetchChannel();
        fetchMessages(true);

        socket?.on('MESSAGE_CREATE', handleMessageCreate);
        socket?.on('UPDATE_MESSAGE_PIN', handleMessagePinned);

        return () => {
            socket?.off('MESSAGE_CREATE', handleMessageCreate);
            socket?.off('UPDATE_MESSAGE_PIN', handleMessagePinned);
        };

    }, [serverId, channelId, socket]);

    const handleMessageCreate = (data: any) => {
        if (data.channel !== channelId) return;
        setMessages(prevMessages => [...prevMessages, data]);
        scrollToBottom();
    };

    const handleMessagePinned = (data: any) => {
        const messageId = data;

        setMessages(prevMessages => {
            return prevMessages.map((message: any) => {
                if (message._id === messageId) {
                    return {
                        ...message,
                        pinned: !message.pinned
                    };
                } else {
                    return message;
                }
            });
        });
    };

    const handleSendMessage = async (target: any) => {
        target.preventDefault();
        socket?.emit('MESSAGE_CREATE', { content: message, serverId, channelId });
        setMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop === 0 && hasMore && !loading) {
            fetchMessages();
        }
    };

    const shouldShowDateDivider = (currentMessage: any, previousMessage: any) => {
        if (!previousMessage) return true;
        const currentDate = new Date(currentMessage.createdAt).toDateString();
        const previousDate = new Date(previousMessage.createdAt).toDateString();
        return currentDate !== previousDate;
    };

    if (!serverId || !channelId) return null;

    return (
        <div className="flex flex-col h-full bg-background-secondary text-white rounded-3xl">
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
                                    <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(message.author.username))} className="w-10 h-10 rounded-full" />
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

            <div ref={messagesContainerRef} className="flex-grow p-4 overflow-y-auto" onScroll={handleScroll}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-gray-400">No messages yet</h1>
                        <h2 className="text-xl text-gray-500">Be the first to send a message</h2>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const previousMessage = messages[index - 1];
                        const showDateDivider = shouldShowDateDivider(message, previousMessage);
                        const showAvatar = !previousMessage || previousMessage.author?._id !== message.author?._id || showDateDivider || index === messages.length - 1 || previousMessage.isSystem;

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
                                                    <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(message.author.username))} className="w-10 h-10 rounded-full" />
                                                )}
                                                <div className={`flex flex-col ${showAvatar ? '' : 'ml-12'}`}>
                                                    {showAvatar && (
                                                        <div className="font-bold hover:underline hover:cursor-pointer">
                                                            {message.author.username}
                                                        </div>
                                                    )}
                                                    <Message message={message} />
                                                </div>
                                            </div>
                                        </div>
                                    </ContextMenu>
                                ) : (
                                    <div className="flex justify-center">
                                        <div className="flex gap-2 items-center p-2 bg-background-primary rounded-lg my-2">
                                            <span className="text-sm text-gray-300">{message.content}</span>
                                        </div>
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
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
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

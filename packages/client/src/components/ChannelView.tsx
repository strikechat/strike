import React, { useEffect, useRef } from 'react';
import { MessageController } from '../lib/MessageController';
import { useParams } from 'react-router-dom';
import { TbMessagePin } from 'react-icons/tb';

export const ChannelView = () => {
    const { serverId, channelId } = useParams();
    const [messages, setMessages] = React.useState<any[]>([]);
    const [skip, setSkip] = React.useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    

    if (!serverId || !channelId) {
        return null;
    }

    const fetchMessages = async () => {
        const newMessages = await MessageController.fetchMessages(serverId, channelId, skip);
        setMessages((prevMessages) => {
            const filteredMessages = newMessages.filter((newMessage: any) => !prevMessages.some(prevMessage => prevMessage._id === newMessage._id));
            const mergedMessages = [...prevMessages, ...filteredMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return mergedMessages;
        });
        setSkip((prev) => prev + 50);
    }

    const handleSendMessage = async (target: any) => {
        const res = await MessageController.sendMessage(target.value, serverId, channelId);

        if (res) {
            setMessages([...messages, res]);
            target.value = '';
            scrollToBottom();
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages])

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="relative flex justify-between items-center p-4 border-b border-gray-700">
                <div>
                    <h1 className="text-xl font-bold">#{channelId}</h1>
                    <h2 className="text-gray-500">Na przyszłość jeżeli będzie topic to tutaj</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative group">
                        <a className="text-gray-500 cursor-pointer" href="#" id="pin-icon">
                            <TbMessagePin className="w-6 h-6" />
                        </a>
                        <div className="absolute right-0 mt-2 w-64 p-4 bg-gray-900 border border-gray-800 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-lg font-semibold mb-2">Przypięte wiadomości</h3>
                            <ul className="list-disc list-inside text-gray-300">
                                {/* TODO: Change logic */}
                                {messages.filter((message) => message.pinned).map((message) => (
                                    <div className="p-4 rounded hover:bg-gray-700" key={message._id}>
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
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {/* Messages container */}

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-gray-400">No messages yet</h1>
                        <h2 className="text-xl text-gray-500">Be the first to send a message</h2>
                    </div>
                )}

                {messages.map((message, index) => {
                    const previousMessage = messages[index - 1];
                    const showAvatar = !previousMessage || previousMessage.author.id !== message.author.id;
                    const showDateDivider = !previousMessage || new Date(previousMessage.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                    return (
                        <div key={message._id}>
                            {showDateDivider && (
                                <div className="text-center text-gray-500 my-4">
                                    {new Date(message.createdAt).toDateString()}
                                </div>
                            )}
                            <div className="p-2 rounded hover:bg-gray-700">
                                <div className="flex flex-row gap-2">
                                    {showAvatar && (
                                        <img src="https://cdn.discordapp.com/avatars/937152156379803658/a_6246465bb3b30e1fcc787390f5d9db86.gif" className="w-10 h-10 rounded-full" />
                                    )}
                                    <div className={`flex flex-col ${showAvatar ? '' : 'ml-12'}`}>
                                        {showAvatar && (
                                            <div className="font-bold">{message.author.username}</div>
                                        )}
                                        <div>{message.content}</div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <input
                    type="text"
                    className="w-full p-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-700 placeholder-white"
                    placeholder="Type a message..."
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    name="message"
                    id="message"
                    onKeyUp={e => e.key === 'Enter' && handleSendMessage(e.currentTarget)}
                />
            </div>
        </div>
    );
};

import React from 'react';

export const ChannelView = () => {
    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="flex-grow p-4 overflow-y-auto">
                {/* Messages container */}
                <div className="space-y-4">
                    <div className="p-4 rounded hover:bg-gray-700">
                        <div className="flex flex-row gap-2">
                            <img src="https://i.pravatar.cc/300" className="w-10 h-10 rounded-full" />
                            <div>
                                <div className="font-bold">Test user</div>
                                <div>Teeeest</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-gray-700">
                <input
                    type="text"
                    className="w-full p-2 bg-gray-600 text-white rounded focus:outline-none"
                    placeholder="Type a message..."
                />
            </div>
        </div>
    );
};

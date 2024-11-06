import { useTranslation } from "react-i18next";
import { FaDiscord, FaUserFriends } from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import { useEffect, useState } from "react";
import { UserController } from "../lib/UserController";

interface IUserData {
    user: { badges: string[], status: number, _id: string, username: string },
    mutualServers: [{ id: string, name: string }]
    mutualFriends: [{ id: string, username: string }]
}

const UserProfile = ({ user }: any) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('servers');
    const [userData, setUserData] = useState<IUserData>();
    const [loading, setLoading] = useState(true);

    // pozna pora, nie chce mi sie myslec, bez tego nie dzialalo 
    const userId = user._id;

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await UserController.getUserData(userId);
            setUserData(response);
            if (response != null) setLoading(false);
        };
        fetchUserData();
    }, [user._id]);

    user = {
        avatar: "https://cdn.discordapp.com/avatars/937152156379803658/a_b5f15d70c2875f6790623e5332a77b18.gif",
        banner: "https://cdn.discordapp.com/banners/937152156379803658/a_16379a092636f5de7074785b80fc27dc.gif",
        bio: "uwu",
        createdDate: "2020-06-15T00:00:00.000Z",
    };

    console.log('final', userData)

    if (loading) {
        return (
            <div className="z-50 flex items-center justify-center bg-opacity-60 w-[50px]">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }

    return (
        <div className="z-50 flex items-center justify-center bg-opacity-60 w-[500px]">
            <div className="w-full max-w-xl rounded-lg p-0 relative overflow-hidden">
                <div className="w-full h-36 bg-cover bg-center" style={{ backgroundImage: `url(${user.banner})` }}>
                </div>

                <div className="flex flex-col items-center -mt-12 mb-4 px-6">
                    <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border-4 border-background-primary shadow-lg" />
                    <h2 className="text-2xl font-bold mt-2">{userData!.user.username || "Brak"}</h2>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        {userData!.user.badges.map((badge: string, index: number) => (
                            <span key={index} className="bg-yellow-400 text-xs px-2 py-1 rounded">{badge}</span>
                        ))}
                    </div>
                </div>

                <div className="px-6 mb-6 text-center">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">{t('app.user_profile.bio')}</h3>
                    <p className="text-sm text-gray-200">{user.bio || t('app.user_profile.no_bio')}</p>
                </div>

                <div className="flex justify-center border-b border-gray-600 mb-4">
                    <button onClick={() => setActiveTab('servers')}
                        className={`py-2 px-6 ${activeTab === 'servers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}>
                        {t('app.user_profile.mutual_servers')}
                    </button>
                    <button onClick={() => setActiveTab('friends')}
                        className={`py-2 px-6 ${activeTab === 'friends' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}>
                        {t('app.user_profile.mutual_friends')}
                    </button>
                </div>

                <div className="px-6">
                    {activeTab === 'servers' ? (
                        <div className="flex flex-wrap gap-3 justify-center">
                            {userData!.mutualServers.length ? (
                                userData!.mutualServers.map((server: any) => (
                                    <div key={server.id} className="flex items-center text-sm text-gray-300 bg-background-secondary px-3 py-2 rounded-lg shadow-md">
                                        <FaDiscord className="mr-2 text-blue-500" /> {server.name}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">{t('app.user_profile.no_mutual_servers')}</p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3 justify-center">
                            {userData!.mutualFriends.length ? (
                                userData!.mutualFriends.map((friend: any) => (
                                    <div key={friend.id} className="flex items-center text-sm text-gray-300 bg-background-secondary px-3 py-2 rounded-lg shadow-md">
                                        <FaUserFriends className="mr-2 text-green-500" /> {friend.username}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">{t('app.user_profile.no_mutual_friends')}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center text-sm text-gray-400 mt-6 mb-4">
                    <AiOutlineCalendar className="mr-2" />
                    {t('app.user_profile.created_on')} {new Date(user.createdDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

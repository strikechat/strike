import { FaCog } from "react-icons/fa";
import { useCachedUser } from "../../lib/hooks/useCachedUser"
import { PlaceholderImage } from "../../lib/PlaceholderImage"
import Tooltip from "../Tooltip"
import { useTranslation } from "react-i18next";

export const UserBox = () => {

    const cachedUser = useCachedUser();
    const { t } = useTranslation();

    return (
        <div className="bg-background-secondary rounded-2xl text-white w-64 h-16 mt-2 mb-2">
            <div className="px-3 flex items-center justify-between h-full">
                <div className="flex items-center gap-2">
                    <img src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(cachedUser.username))} className="w-10 h-10 rounded-full" />
                    <span className="font-bold">
                        {cachedUser.username}
                    </span>
                </div>
                <div className="text-xl text-gray-300">
                    <Tooltip content={t('app.user_box.open_settings')} position="top">
                        <FaCog />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
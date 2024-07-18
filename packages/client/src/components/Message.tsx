import { useEffect, useState } from "react"
import { InviteController } from "../lib/InviteController";
import { PlaceholderImage } from "../lib/PlaceholderImage";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useServer } from "../lib/context/ServerContext";

const INVITE_REGEX = /strike.gg\/invite\/([a-zA-Z0-9]{6,64})/;

export const Message = ({ message }: { message: any }) => {
    const { t } = useTranslation();
    const match = message.content.match(INVITE_REGEX)
    const code = match && match[1];
    const { fetchServers } = useServer();
    const [inviteEmbed, setInviteEmbed] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (match && code) {
            renderInviteEmbed(code, t, fetchServers).then(embed => {
                setInviteEmbed(embed)
            }).catch(e => {
                console.log(e);
            })
        }
    }, [message.content])

    return (
        <>
            {code && match ? (
                <>
                    {inviteEmbed}
                </>
            ) : (
                <>
                    {message.content}
                </>
            )}
        </>
    )
}

const renderInviteEmbed = async (code: string, t: any, fetchServers: () => Promise<void>): Promise<JSX.Element> => {
    const invite = await InviteController.fetchInvite(code);

    const handleClick = async (): Promise<void> => {
        const res = await InviteController.joinInvite(code);
        await fetchServers();
        window.location.href = `/server/${res.serverId}/channel/${res.channelId}`;
    }

    const validInvite = invite && new Date(invite.expiresAt) > new Date() && invite.uses < invite.maxUses;

    return (
        <>
            {validInvite ? (
                <div className="p-4 bg-background-primary rounded-lg flex items-center w-96">
                    <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(invite.server.name))} />
                    <div className="ml-4">
                        <div className="text-xl font-bold">{invite.server.name}</div>
                        <div className="text-sm text-gray-400">{t('app.message.invite.valid_until')} {new Date(invite.expiresAt).toLocaleString()}</div>
                    </div>
                    <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded" onClick={handleClick}>{t('app.message.invite.join')}</button>
                </div>
            ) : (
                <div className="p-4 bg-background-primary rounded-lg flex items-center w-full">
                    <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, "?")} />
                    <div className="ml-4">
                        <div className="text-xl font-bold">{t('app.message.invalid_invite.invalid')}</div>
                        <div className="text-sm text-gray-400">{t('app.message.invalid_invite.description')}</div>
                    </div>
                </div>
            )}
        </>
    )
}

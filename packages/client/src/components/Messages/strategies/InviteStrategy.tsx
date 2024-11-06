import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {useServer} from "../../../lib/context/ServerContext.tsx";
import {InviteController} from "../../../lib/InviteController.ts";
import { PlaceholderImage } from "../../../lib/PlaceholderImage.ts";
import { MessageStrategy } from "../MessageStrategy.ts";

export const InviteStrategy: MessageStrategy = {
    regex: /strike.gg\/invite\/([a-zA-Z0-9]{6,64})/,
    render: (match: RegExpMatchArray, message: any) => {
        const { t } = useTranslation();
        const { fetchServers } = useServer();
        const code = match[1];
        const [invite, setInvite] = useState<any>(null);
        const [isValidInvite, setIsValidInvite] = useState<boolean>(false);

        useEffect(() => {
            InviteController.fetchInvite(code).then(invite => {
                setInvite(invite);
                setIsValidInvite(new Date(invite.expiresAt) > new Date() && invite.uses < invite.maxUses);
            })
        }, [code]);

        const handleClick = async (): Promise<void> => {
            const res = await InviteController.joinInvite(code);
            await fetchServers();
            window.location.href = `/server/${res.serverId}/channel/${res.channelId}`;
        }

        if (!invite) return null;

        return (
            <>
                {message.content}
                <div className="p-4 bg-background-primary rounded-lg flex items-center w-full">
                    {isValidInvite ? (
                        <>
                            <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(invite.server.name))} />
                            <div className="ml-4">
                                <div className="text-xl font-bold">{invite.server.name}</div>
                                <div className="text-sm text-gray-400">{t('app.message.invite.valid_until')} {new Date(invite.expiresAt).toLocaleString()}</div>
                            </div>
                            <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded" onClick={handleClick}>{t('app.message.invite.join')}</button>
                        </>
                    ) : (
                        <>
                            <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, "?")} />
                            <div className="ml-4">
                                <div className="text-xl font-bold">{t('app.message.invalid_invite.invalid')}</div>
                                <div className="text-sm text-gray-400">{t('app.message.invalid_invite.description')}</div>
                            </div>
                        </>
                    )}
                </div>
            </>
        );
    }
};

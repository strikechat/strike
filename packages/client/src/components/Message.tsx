import { useEffect, useState } from "react"
import { InviteController } from "../lib/InviteController";
import { PlaceholderImage } from "../lib/PlaceholderImage";

const INVITE_REGEX = /strike.gg\/invite\/([a-zA-Z0-9]{6,64})/;

export const Message = ({ message }: { message: any }) => {
    const match = message.content.match(INVITE_REGEX)
    const code = match && match[1];
    const [inviteEmbed, setInviteEmbed] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (match && code) {
            renderInviteEmbed(code).then(embed => {
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

const renderInviteEmbed = async (code: string): Promise<JSX.Element> => {
    const invite = await InviteController.fetchInvite(code);

    const handleClick = async () => {
        await InviteController.joinInvite(code);
    }

    return (
        <>
            {invite ? (
                <div className="p-4 bg-gray-700 rounded-lg flex items-center w-96">
                    <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, PlaceholderImage.getFirstLetters(invite.server.name))} />
                    <div className="ml-4">
                        <div className="text-xl font-bold">{invite.server.name || 'Invalid ivnite'}</div>
                        <div className="text-sm text-gray-400">Ważne do: {new Date(invite.expiresAt).toLocaleString()}</div>
                    </div>
                    <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded" onClick={handleClick}>Dołącz</button>
                </div>
            ) : (
                <div className="p-4 bg-gray-700 rounded-lg flex items-center w-full">
                    <img className='rounded-full w-10 h-10' src={PlaceholderImage.getSrc(64, 64, "?")} />
                    <div className="ml-4">
                        <div className="text-xl font-bold">{'Invalid invite'}</div>
                        <div className="text-sm text-gray-400">Zaproszenie jest niepoprawne, poproś znajomego o wygenerowanie nowego</div>
                    </div>
                </div>
            )}
        </>
    )
}

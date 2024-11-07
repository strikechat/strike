import { useTranslation } from "react-i18next";
import { useModal } from "../../../lib/context/ModalContext";
import { MessageStrategy } from "../MessageStrategy";

export const BoldStrategy: MessageStrategy = {
    regex: /\*\*(.*?)\*\*/g,
    render: (match: RegExpMatchArray) => <strong>{match[1]}</strong>,
};

export const ItalicStrategy: MessageStrategy = {
    regex: /\*(.*?)\*/g,
    render: (match: RegExpMatchArray) => <em>{match[1]}</em>,
};


export const LinkStrategy: MessageStrategy = {
    regex: /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g,
    render: (match: RegExpMatchArray) => {
        const { showModal, hideModal } = useModal();
        const { t } = useTranslation();

        const LinkModal = ({ url }: { url: string }) => (
            <>
                <h2 className="text-lg font-semibold text-white">{t('app.message.confirm_link_modal.title')}</h2>
                <p className="text-gray-400 mt-4">
                    {t('app.message.confirm_link_modal.warning')}<br />
                    {t('app.message.confirm_link_modal.current_link')}
                </p>
                <blockquote className="border-l-4 border-gray-500 bg-background-secondary p-3 text-link mt-2 break-all">
                    {url}
                </blockquote>
                <p className="text-xs text-gray-400 mt-4">
                    {t('app.message.confirm_link_modal.link_warning')}
                </p>
            </>
        )

        const openLink = () => {
            window.open(match[2], '_blank', 'noopener,noreferrer');
        }

        const handleClick = (e: MouseEvent) => {
            e.preventDefault();
            showModal(<LinkModal url={match[2]} />, openLink, hideModal);
        }

        return (
            <a
                href={match[2]}
                onClick={(e: any) => handleClick(e)}
                className="text-link hover:text-link-hover hover:underline"
            >
                {match[1]}
            </a>
        )
    },
};

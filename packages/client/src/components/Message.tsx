import { strategies } from "./Messages/strategies";

export const Message = ({ message }: { message: any }) => {
    for (const strategy of strategies) {
        const match = message.content.match(strategy.regex);
        if (match) {
            return strategy.render(match, message);
        }
    }

    return <div>{message.content}</div>
}
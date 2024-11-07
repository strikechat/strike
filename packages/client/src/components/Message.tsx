import React from "react";
import { strategies } from "./Messages/strategies";

export const Message = ({ message }: { message: any }) => {
    let elements: (JSX.Element | string)[] = [message.content];

    strategies.forEach((strategy) => {
        elements = elements.flatMap((element) => {
            if (typeof element !== "string") return [element];

            const parts: (JSX.Element | string)[] = [];
            let lastIndex = 0;
            const regex = new RegExp(strategy.regex, strategy.regex.flags.includes("g") ? strategy.regex.flags : strategy.regex.flags + "g");
            const matches = Array.from(element.matchAll(regex));

            matches.forEach((match) => {
                parts.push(element.slice(lastIndex, match.index!));
                parts.push(strategy.render(match, message) as JSX.Element);
                lastIndex = match.index! + match[0].length;
            });

            parts.push(element.slice(lastIndex));
            return parts;
        });
    });

    return <div>{elements.map((el, idx) => <React.Fragment key={idx}>{el}</React.Fragment>)}</div>;
}

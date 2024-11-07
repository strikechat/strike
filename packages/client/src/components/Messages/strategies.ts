import { MessageStrategy } from "./MessageStrategy";
import { InviteStrategy } from "./strategies/InviteStrategy";
import { BoldStrategy, ItalicStrategy, LinkStrategy } from "./strategies/MarkdownStrategy";

export const strategies: MessageStrategy[] = [
    InviteStrategy,
    BoldStrategy,
    ItalicStrategy,
    LinkStrategy
]

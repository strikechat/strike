export interface MessageStrategy {
    regex: RegExp;
    render: (match: RegExpMatchArray, message: any) => JSX.Element | null;
}

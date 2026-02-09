export interface Token {
    toString(): string;
}

export interface State<T extends Token> {
    value(): string;
    update(token: T): void;
    isTerminal(): boolean;
    terminalToken(): T;
}

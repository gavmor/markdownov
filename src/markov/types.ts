export interface Token {
    toString(): string;
}

export interface State<T extends Token> {
    id(): string;
    update(token: T): void;
    isTerminal(): boolean;
    terminalToken(): T;
}

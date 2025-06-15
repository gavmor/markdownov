export interface Token {
    toString(): string;
}

export interface Order<T extends Token> {
    initialState(): State<T>;
    tokenize(text: string): T[];
}

export interface State<T extends Token> {
    id(): string;
    update(token: T): void;
    isTerminal(): boolean;
    terminalToken(): T;
}

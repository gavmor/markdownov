export interface Token {
    toString(): string;
}

export interface Order<T extends Token> {
    // TODO: remove textBoundary
    textBoundary(): T[];
    initialState(): State<T>;
    tokenize(text: string): T[];
    defaultToken(): T;
}

export interface State<T extends Token> {
    id(): string;
    update(token: T): void;
    isTerminal(): boolean;
}

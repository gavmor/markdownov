import {State} from "../types.js"

const END = ""

export class Order1State implements State<string> {
    token = END

    value(): string {
        return this.token
    }

    update(token: string): void {
        this.token = token
    }

    isTerminal(): boolean {
        return this.token === END
    }

    terminalToken(): string {
        return END
    }
}

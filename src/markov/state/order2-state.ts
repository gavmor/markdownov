import {State} from "../types.js"

const END = ""

export class Order2State implements State<string> {
    last = END
    lastButOne = END

    value(): string {
        return this.tail().join("")
    }

    update(token: string): void {
        this.lastButOne = this.last
        this.last = token
    }

    tail(): string[] {
        return [this.lastButOne, this.last]
    }

    isTerminal(): boolean {
        return this.lastButOne === END && this.last === END
    }

    terminalToken(): string {
        return END
    }
}

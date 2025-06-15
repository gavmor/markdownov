import {equals} from "@benchristel/taste"
import {State} from "../types.js"
import {repeat} from "../../arrays.js"

export class PosTaggedToken {
    constructor(public word: string, public tag: string) {}

    isEnd(): boolean {
        return false
    }

    toString(): string {
        return this.word
    }
}

export class EndToken extends PosTaggedToken {
    constructor() {
        super("", "")
    }

    isEnd(): boolean {
        return true
    }
}

const order = 6
const textBoundary: PosTaggedToken[] = repeat(order, () => new EndToken())

export class PosTaggedState implements State<PosTaggedToken> {
    tail = [...textBoundary]

    id(): string {
        return this.tail.map((token, i) => {
            return /^[A-Za-z0-9]/.test(token.word)
                ? token.tag
                : token.word
        }).join(":")
    }

    update(token: PosTaggedToken): void {
        this.tail.push(token)
        this.tail.shift()
    }

    isTerminal(): boolean {
        return equals(this.tail, textBoundary)
    }

    terminalToken(): PosTaggedToken {
        return new EndToken()
    }
}

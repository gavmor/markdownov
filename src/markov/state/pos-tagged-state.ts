import {equals} from "@benchristel/taste"
import pos from "pos"
import {State} from "../types.js"
import {repeat} from "../../arrays.js"

export class PosTaggedToken {
    constructor(
        public readonly word: string,
        private readonly _tag: string,
    ) {}

    get tag(): string {
        return this.isSpaceOrPunctuation() ? "_" : this._tag
    }

    isEnd(): boolean {
        return false
    }

    isSpaceOrPunctuation(): boolean {
        return /^[^0-9\p{L}\p{M}]/u.test(this.word)
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

const order = 7
const textBoundary: PosTaggedToken[] = repeat(order, () => new EndToken())

export class PosTaggedState implements State<PosTaggedToken> {
    tail = [...textBoundary]

    id(): string {
        const id = this.tail.map((token, i) => {
            return i >= order - 2 || token.isSpaceOrPunctuation()
                ? token.word
                : token.tag
        }).join(":")
        return id
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

export function tokenizeWithPosTags(text: string): PosTaggedToken[] {
    const tagger = new pos.Tagger()
    const tokens = text.split(/\b/)
    return tagger.tag(tokens).map(([word, tag]: [string, string]) =>
        new PosTaggedToken(word, tag),
    )
}

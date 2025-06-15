import {equals} from "@benchristel/taste"
import pos from "pos"
import {Tag} from "en-pos"
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
    const tokens = text.split(punctuation).filter(Boolean)
    const words = tokens.filter(isWord)
    const taggedWords = tagWithEnPos(words)
    const tokenIterator = tokens[Symbol.iterator]()
    const ret: PosTaggedToken[] = []
    for (let [word, tag] of taggedWords) {
        for (const token of tokenIterator) {
            if (word.includes(token)) {
                ret.push(new PosTaggedToken(token, tag))
                break
            } else {
                ret.push(new PosTaggedToken(token, "_"))
            }
        }
    }
    for (const token of tokenIterator) {
        ret.push(new PosTaggedToken(token, "_"))
    }
    return ret
}

function tagWithEnPos(words: string[]): [string, string][] {
    const result = new Tag(words).initial().smooth()
    return zip(result.tokens, result.tags)
}

function tagWithPos(words: string[]): [string, string][] {
    const tagger = new pos.Tagger()
    return tagger.tag(words)
}

function zip<A, B>(as: A[], bs: B[]): [A, B][] {
    const len = Math.min(as.length, bs.length)
    const ret: [A, B][] = new Array(len)
    for (let i = 0; i < len; i++) {
        ret[i] = [as[i], bs[i]]
    }
    return ret
}

function isWord(s: string): boolean {
    return s.length > 0 && !punctuation.test(s)
}

const punctuation = /([\s\.,;:'"<>/?!@#$%^&*()\-_+=|\\\[\]{}`~]+)/

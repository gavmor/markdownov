import {equals} from "@benchristel/taste"
import pos from "pos"
import {State} from "../types.js"
import {repeat, zip} from "../../arrays.js"
import {DelimiterStack} from "./delimiter-stack.js"

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

    newlineTrailer(): string | undefined {
        return this.word.match(/\n[^]*$/)?.[0]
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
const literalTokensInContext = 2
const textBoundary: PosTaggedToken[] = repeat(order, () => new EndToken())

export class PosTaggedState implements State<PosTaggedToken> {
    private tail = [...textBoundary]
    private lastNonwordWithNewline = ""
    private delimiterStack = new DelimiterStack()

    value(): string {
        const unmatchedDelims = this.delimiterStack.getDelimiters()
        const id = [
            unmatchedDelims.join(","),
            this.lastNonwordWithNewline,
            ...this.tail.map((token, i) =>
                i >= order - literalTokensInContext || token.isSpaceOrPunctuation()
                    ? token.word
                    : token.tag,
            ),
        ].join(":")

        return id
    }

    update(token: PosTaggedToken): void {
        const newlineTrailer = token.newlineTrailer()
        if (newlineTrailer != null) {
            this.lastNonwordWithNewline = newlineTrailer
        }
        this.tail.push(token)
        this.tail.shift()

        this.delimiterStack.process(token.word)
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
    const taggedWords = tagWithPos(words)
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

function tagWithPos(words: string[]): [string, string][] {
    const tagger = new pos.Tagger()
    return tagger.tag(words)
}

function isWord(s: string): boolean {
    return s.length > 0 && !punctuation.test(s)
}

const punctuation = /([\s.,;:'"<>/?!@#$%^&*()\-+=|\\[\]{}`~]+|(?<!\w)_|_(?!\w))/

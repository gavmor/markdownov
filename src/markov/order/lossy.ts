import {equals} from "@benchristel/taste"
import {tokenize} from "../../tokenize.js"
import {Order, State} from "../types.js"

const END = ""
const textBoundary: typeof END[] = [END, END, END, END, END, END, END]

export class Lossy implements Order<string> {
    textBoundary(): typeof END[] {
        return textBoundary
    }

    initialState(): State<string> {
        return new LossyState()
    }

    tokenize(text: string): string[] {
        return [
            ...tokenize(text, this.tokenRegex()),
            ...this.textBoundary(),
        ]
    }

    defaultToken(): string {
        return END
    }

    tokenRegex(): RegExp {
        return /^([0-9\p{L}\p{M}]+|[^0-9\p{L}\p{M}]+)/u
    }
}

export class LossyState implements State<string> {
    private lastNonwordWithNewline = ""
    private tail: string[] = [...textBoundary]

    order = this.tail.length

    id(): string {
        return [
            this.lastNonwordWithNewline,
            ...this.tail.map((token, i) =>
                i < this.order - 2
                    ? this.efface(token)
                    : token,
            ),
        ].join("")
    }

    update(token: string): void {
        if (token.includes("\n")) {
            // TODO: connascence of algorithm with tokenizer
            this.lastNonwordWithNewline =
                token.match(/\n.*/m)?.[0] ?? ""
        }

        this.tail.push(token)
        this.tail.shift()
    }

    isTerminal(): boolean {
        return equals(this.tail, textBoundary)
    }

    private efface(token: string): string {
        return token.match(/^\w/)
            ? token[token.length - 1]
            : token
    }
}

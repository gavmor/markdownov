import {tokenize} from "../../tokenize.js"
import {Order, State, END} from "../types.js"

export class Lossy implements Order {
    textBoundary(): typeof END[] {
        return new LossyState().tail().map(() => END)
    }

    initialState(): State {
        return new LossyState()
    }

    tokenize(text: string): string[] {
        return [
            ...this.textBoundary(),
            ...tokenize(text, this.tokenRegex()),
            ...this.textBoundary(),
        ]
    }

    tokenRegex(): RegExp {
        return /^([0-9\p{L}\p{M}]+|[^0-9\p{L}\p{M}]+)/u
    }
}

export class LossyState implements State {
    lastNonwordWithNewline = ""
    _tail = [END, END, END, END, END, END, END]
    order = this._tail.length

    id(): string {
        return [
            this.lastNonwordWithNewline,
            ...this._tail.map((token, i) =>
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

        this._tail.push(token)
        this._tail.shift()
    }

    tail(): string[] {
        return [...this._tail]
    }

    efface(token: string): string {
        return token.match(/^\w/)
            ? token[token.length - 1]
            : token
    }
}

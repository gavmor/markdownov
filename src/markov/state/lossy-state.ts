import {equals} from "@benchristel/taste"
import {State} from "../types.js"

const END = ""
const textBoundary: typeof END[] = [END, END, END, END, END, END, END]

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

    terminalToken(): string {
        return END
    }

    private efface(token: string): string {
        return token.match(/^\w/)
            ? token[token.length - 1]
            : token
    }
}

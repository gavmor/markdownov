import {equals} from "@benchristel/taste"
import {tokenize} from "../../tokenize.js"
import {Order, State} from "../types.js"

const END = ""
const textBoundary: typeof END[] = [END, END]

export class MarkdownAwareOrder2 implements Order<string> {
    textBoundary(): typeof END[] {
        return textBoundary
    }

    initialState(): State<string> {
        return new MarkdownAwareOrder2State()
    }

    tokenize(text: string): string[] {
        return [
            ...tokenize(text),
            ...textBoundary,
        ]
    }

    defaultToken(): string {
        return END
    }
}

export class MarkdownAwareOrder2State implements State<string> {
    lastNonwordWithNewline = ""
    last = END
    lastButOne = END

    id(): string {
        return [this.lastNonwordWithNewline, this.lastButOne, this.last].join("")
    }

    update(token: string): void {
        if (this.lastButOne.includes("\n")) {
            // TODO: connascence of algorithm with tokenizer
            this.lastNonwordWithNewline =
                this.lastButOne.match(/\n.*/m)?.[0] ?? ""
        }

        if (token.includes("\n\n")) {
            // `[^]` matches any character including newlines.
            // `.` doesn't match newlines.
            this.last = token.match(/\n[^]*/)?.[0] ?? "\n\n"
        } else {
            this.lastButOne = this.last
            this.last = token
        }
    }

    isTerminal(): boolean {
        return equals([this.lastButOne, this.last], textBoundary)
    }

    terminalToken(): string {
        return END
    }
}

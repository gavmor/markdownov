export class DelimiterStack {
    private stack: string[] = []

    getDelimiters(): string[] {
        return [...this.stack]
    }

    process(token: string): void {
        for (const [delimiter] of token.matchAll(delimiterRegex)) {
            this.processDelimiter(delimiter)
        }
    }

    processDelimiter(delimiter: string): void {
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const unmatchedOpenDelim = this.stack[i]
            if (isOpeningMatchFor(delimiter, unmatchedOpenDelim)) {
                this.stack = this.stack.slice(0, i)
                return
            }
            if (isCode(unmatchedOpenDelim)) {
                // don't close a delimiter outside a code block with one inside.
                break
            }
        }
        if (couldBeOpening(delimiter)) {
            this.stack.push(delimiter)
        }
    }
}

const delimiterRegex = /[()[\]{}“”]|(\s|^)(["_]|\*\*)|(["_]|\*\*)([\s,:.!?]|$)|```|`/g

function couldBeOpening(delimiter: string): boolean {
    return /\(|{|\[|“|(["*_]|\*\*)$|```|`/.test(delimiter)
}

function isOpeningMatchFor(closing: string, opening: string): boolean {
    return opening === "(" && closing === ")"
        || opening === "{" && closing === "}"
        || opening === "[" && closing === "]"
        || opening === "```" && closing === "```"
        || opening === "`" && closing === "`"
        || opening.endsWith(`"`) && closing.startsWith(`"`)
        || opening.endsWith(`“`) && closing.startsWith(`”`)
        || opening.endsWith("_") && closing.startsWith("_")
        || opening.endsWith("**") && closing.startsWith("**")
}

function isCode(delimiter: string): boolean {
    return /`/.test(delimiter)
}

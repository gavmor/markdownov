import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const EOT = ""

export class MarkovModel {
    private transitions: Record<string, string[]> = {
        [EOT]: [],
    }

    constructor(private rng: () => number) {}

    train(text: string) {
        // TODO: hardcoded order
        const tokens = [EOT, ...tokenize(text), EOT]
        // TODO: hardcoded order
        for (let i = 1; i < tokens.length; i++) {
            const token = tokens[i]
            const previous = tokens[i - 1]
            this.transitions[previous] ??= []
            this.transitions[previous].push(token)
        }
    }

    generate(): string {
        let generated = [EOT]
        let last = EOT
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = pick(this.rng, this.transitions[last], EOT)
            generated.push(next)
            if (next === EOT) break
            last = next
        }
        return generated.join("")
    }
}

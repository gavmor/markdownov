import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const END = ""

export interface Context {
    id(): string;
    afterObserving(token: string): Context;
    empty(): Context;
    textBoundary(): string[];
    isEndOfText(): boolean;
}

class Order1 implements Context {
    token = END

    id(): string {
        return this.token
    }

    afterObserving(token: string): Context {
        this.token = token
        return this
    }

    empty(): Context {
        return new Order1()
    }

    textBoundary(): string[] {
        return [END]
    }

    isEndOfText(): boolean {
        return this.token === END
    }
}

export class MarkovModel {
    private transitions: Record<string, string[]> = {}
    private initialContext: Context

    constructor(
        private rng: () => number,
        initialContext = new Order1(),
    ) {
        this.initialContext = initialContext.empty()
    }

    train(text: string) {
        const textBoundary = this.initialContext.textBoundary()
        const tokens = [
            ...textBoundary,
            ...tokenize(text),
            ...textBoundary,
        ]
        let context = this.initialContext
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            this.transitions[context.id()] ??= []
            this.transitions[context.id()].push(token)
            context = context.afterObserving(token)
        }
    }

    generate(): string {
        let generated = this.initialContext.textBoundary()
        let context = this.initialContext
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(context)
            generated.push(next)
            context = context.afterObserving(next)
            if (context.isEndOfText()) break
        }
        return generated.join("")
    }

    private predictFrom(context: Context): string {
        return pick(this.rng, this.transitions[context.id()] ?? [END])
    }
}

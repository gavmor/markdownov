import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const END = ""

export interface State {
    id(): string;
    afterObserving(token: string): State;
    empty(): State;
    textBoundary(): typeof END[];
    isEndOfText(): boolean;
}

class Order1 implements State {
    token = END

    id(): string {
        return this.token
    }

    afterObserving(token: string): State {
        this.token = token
        return this
    }

    empty(): State {
        return new Order1()
    }

    textBoundary(): typeof END[] {
        return [END]
    }

    isEndOfText(): boolean {
        return this.token === END
    }
}

export class MarkovModel {
    private transitions: Record<string, string[]> = {}
    private initialState: State

    constructor(
        private rng: () => number,
        initialState = new Order1(),
    ) {
        this.initialState = initialState.empty()
    }

    train(text: string) {
        const textBoundary = this.initialState.textBoundary()
        const tokens = [
            ...textBoundary,
            ...tokenize(text),
            ...textBoundary,
        ]
        let state = this.initialState
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            this.transitions[state.id()] ??= []
            this.transitions[state.id()].push(token)
            state = state.afterObserving(token)
        }
    }

    generate(): string {
        let generated: string[] = this.initialState.textBoundary()
        let state = this.initialState
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(state)
            generated.push(next)
            state = state.afterObserving(next)
            if (state.isEndOfText()) break
        }
        return generated.join("")
    }

    private predictFrom(state: State): string {
        const possibilities = this.transitions[state.id()] ?? [END]
        return pick(this.rng, possibilities)
    }
}

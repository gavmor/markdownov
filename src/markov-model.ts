import {equals} from "@benchristel/taste"
import {pick} from "./random.js"
import {tokenize} from "./tokenize.js"

const END = ""

export interface Order {
    textBoundary(): typeof END[];
    initialState(): State;
}

export interface State {
    id(): string;
    afterObserving(token: string): State;
    tail(): string[];
}

class Order1 implements Order {
    textBoundary(): typeof END[] {
        return [END]
    }

    initialState(): State {
        return new Order1State()
    }
}

class Order1State implements State {
    token = END

    id(): string {
        return this.token
    }

    afterObserving(token: string): State {
        this.token = token
        return this
    }

    tail(): string[] {
        return [this.token]
    }
}

export class MarkovModel {
    private readonly transitions: Record<string, string[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly order = new Order1(),
    ) {}

    train(text: string) {
        const textBoundary = this.order.textBoundary()
        const tokens = [
            ...textBoundary,
            ...tokenize(text),
            ...textBoundary,
        ]
        let state = this.order.initialState()
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            ;(this.transitions[state.id()] ??= []).push(token)
            state = state.afterObserving(token)
        }
    }

    generate(): string {
        let generated: string[] = this.order.textBoundary()
        let state = this.order.initialState()
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(state)
            generated.push(next)
            state = state.afterObserving(next)
            if (this.isEndOfText(state)) break
        }
        return generated.join("")
    }

    private predictFrom(state: State): string {
        const possibilities = this.transitions[state.id()] ?? [END]
        return pick(this.rng, possibilities)
    }

    private isEndOfText(state: State): boolean {
        return equals(state.tail(), this.order.textBoundary())
    }
}

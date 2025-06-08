import {equals} from "@benchristel/taste"
import {pick} from "../random.js"
import {tokenize} from "../tokenize.js"
import {State, END} from "./types.js"
import {Order1} from "./order1.js"

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
            state.update(token)
        }
    }

    generate(): string {
        let generated: string[] = this.order.textBoundary()
        let state = this.order.initialState()
        // TODO: magic number
        for (let i = 0; i < 42; i++) {
            const next = this.predictFrom(state)
            generated.push(next)
            state.update(next)
            if (this.isEndOfText(state)) break
        }
        return generated.join("")
    }

    private predictFrom(state: State): string {
        // TODO: the dependency on END is gross. Could State predict its own
        // next states, given transitions? Maybe transitions should be built
        // by Order?
        const possibilities = this.transitions[state.id()] ?? [END]
        return pick(this.rng, possibilities)
    }

    private isEndOfText(state: State): boolean {
        return equals(state.tail(), this.order.textBoundary())
    }
}

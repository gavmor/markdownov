import {equals} from "@benchristel/taste"
import {pick} from "../random.js"
import {State, END, Order} from "./types.js"
import {Order1} from "./order1.js"
import {take} from "../iterators.js"

export class MarkovModel {
    private readonly transitions: Record<string, string[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly order: Order = new Order1(),
    ) {}

    train(text: string) {
        const textBoundary = this.order.textBoundary()
        const tokens = this.order.tokenize(text)
        let state = this.order.initialState()
        for (let i = textBoundary.length; i < tokens.length; i++) {
            const token = tokens[i]
            // TODO: this is gross. `transitions` really needs to be an object.
            ;(this.transitions[state.id()] ??= []).push(token)
            state.update(token)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    *generateTokens(): Generator<string, void, undefined> {
        yield* this.order.textBoundary()
        let state = this.order.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next)
        } while (!this.isEndOfText(state))
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

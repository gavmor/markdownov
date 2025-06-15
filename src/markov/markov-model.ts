import {pick} from "../random.js"
import {State, Order, Token} from "./types.js"
import {take} from "../iterators.js"

export class MarkovModel<T extends Token> {
    private readonly transitions: Record<string, T[] | undefined> = {}

    constructor(
        private readonly rng: () => number,
        private readonly order: Order<T>,
    ) {}

    train(text: string) {
        const tokens = this.order.tokenize(text)
        let state = this.order.initialState()
        for (const token of tokens) {
            this.recordTransition(state, token)
            state.update(token)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    *generateTokens(): Generator<T, void, undefined> {
        yield* this.order.textBoundary()
        let state = this.order.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next)
        } while (!state.isTerminal())
    }

    private predictFrom(state: State<T>): T {
        return pick(this.rng, this.possibilities(state))
            ?? this.order.defaultToken()
    }

    private recordTransition(from: State<T>, to: T): void {
        // TODO: Might be primitive obsession? Make transitions a class?
        (this.transitions[from.id()] ??= []).push(to)
    }

    private possibilities(state: State<T>): T[] {
        // TODO: Might be primitive obsession? Make transitions a class?
        return this.transitions[state.id()] ?? []
    }
}

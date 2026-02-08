import {pick} from "../random.js"
import {State, Token} from "./types.js"
import {take} from "../iterators.js"

class Transitions<TokenT extends Token> {
    private readonly storage: Record<string, TokenT[] | undefined> = {}

    constructor(private readonly rng: () => number) { }

    record(from: State<TokenT>, to: TokenT): void {
        (this.storage[from.id()] ??= []).push(to)
    }

    pick(state: State<TokenT>): TokenT {
        return pick(this.rng, this.storage[state.id()] ?? []) ?? state.terminalToken()
    }

    possibilities(stateId: string): TokenT[] {
        return this.storage[stateId] ?? []
    }
}

export class MarkovModel<TokenT extends Token> {
    private readonly transitions: Transitions<TokenT>

    constructor(
        rng: () => number,
        private readonly initialState: () => State<TokenT>,
    ) {
        this.transitions = new Transitions<TokenT>(rng)
    }

    train(tokens: Iterable<TokenT>) {
        let state = this.initialState()
        for (const token of tokens) {
            this.recordTransition(state, token)
            state.update(token)
        }
        while (!state.isTerminal()) {
            const token = state.terminalToken()
            this.recordTransition(state, token)
            state.update(token)
        }
    }

    generate(limit = 100_000): string {
        return [...take(limit, this.generateTokens())].join("")
    }

    private *generateTokens(): Generator<TokenT, void, undefined> {
        let state = this.initialState()
        do {
            const next = this.predictFrom(state)
            yield next
            state.update(next)
        } while (!state.isTerminal())
    }

    private predictFrom(state: State<TokenT>): TokenT {
        return this.transitions.pick(state)
    }

    private recordTransition(from: State<TokenT>, to: TokenT): void {
        this.transitions.record(from, to)
    }
}

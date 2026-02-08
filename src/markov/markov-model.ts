import {pick} from "../random.js"
import {State, Token} from "./types.js"
import {take} from "../iterators.js"

class Transitions<TokenT extends Token> {
    private readonly storage: Record<string, TokenT[] | undefined> = {}

    record(from: string, to: TokenT): void {
        (this.storage[from] ??= []).push(to)
    }

    possibilities(stateId: string): TokenT[] {
        return this.storage[stateId] ?? []
    }
}

export class MarkovModel<TokenT extends Token> {
    private readonly transitions = new Transitions<TokenT>()

    constructor(
        private readonly rng: () => number,
        private readonly initialState: () => State<TokenT>,
    ) {}

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
        // TODO: make pick a method on Transitions and call it here.
        return pick(this.rng, this.transitions.possibilities(state.id()))
            ?? state.terminalToken()
    }

    private recordTransition(from: State<TokenT>, to: TokenT): void {
        this.transitions.record(from.id(), to)
    }
}

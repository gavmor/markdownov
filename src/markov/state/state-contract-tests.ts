import {test, expect, is} from "@benchristel/taste"
import {State} from "../types.js"

type UnknownToken = {toString(): string}

export function testBehavesLikeState(TheState: new () => State<UnknownToken>) {
    test(TheState.name, {
        "terminates given the default token"() {
            const state = new TheState()
            state.update(state.terminalToken())
            expect(state.isTerminal(), is, true)
        },
    })
}

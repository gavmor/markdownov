import {test, expect, is} from "@benchristel/taste"
import {Order} from "../types.js"

type UnknownToken = {toString(): string}

export function testBehavesLikeOrder(order: Order<UnknownToken>) {
    test(order.constructor.name, {
        "terminates given the default token"() {
            let state = order.initialState()
            state.update(order.defaultToken())
            expect(state.isTerminal(), is, true)
        },
    })
}

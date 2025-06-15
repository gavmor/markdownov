import {test, expect, is} from "@benchristel/taste"
import {PosTaggedState, PosTaggedToken} from "./pos-tagged-state.js"
import {testBehavesLikeState} from "./state-contract-tests.js"

testBehavesLikeState(PosTaggedState)

test("PosTaggedState", {
    "includes POS tags in id"() {
        const state = new PosTaggedState()
        state.update(new PosTaggedToken("the", "DET"))
        state.update(new PosTaggedToken("bear", "N"))
        state.update(new PosTaggedToken("did", "VPST"))
        state.update(new PosTaggedToken("not", "NEG"))
        state.update(new PosTaggedToken("order", "V"))
        state.update(new PosTaggedToken("beer", "N"))
        expect(state.id(), endsWith, "DET:N:VPST:NEG:V:N")
    },

    "does not use POS tags for punctuation"() {
        const state = new PosTaggedState()
        state.update(new PosTaggedToken(",", "PUNCT"))
        expect(state.id(), endsWith, ":,")
    },
})

test("PosTaggedToken", {
    "stringifies to the word it contains"() {
        const token = new PosTaggedToken("the-word", "the-tag")
        expect(token.toString(), is, "the-word")
    },
})

function endsWith(suffix: string, s: string): boolean {
    return s.endsWith(suffix)
}

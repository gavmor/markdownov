import {test, expect, equals, is} from "@benchristel/taste"
import {PosTaggedState, PosTaggedToken, tokenizeWithPosTags} from "./pos-tagged-state.js"
import {testBehavesLikeState} from "./state-contract-tests.js"

testBehavesLikeState(PosTaggedState)

test("PosTaggedState", {
    "includes POS tags in value"() {
        const state = new PosTaggedState()
        state.update(new PosTaggedToken("the", "DET"))
        state.update(new PosTaggedToken("bear", "N"))
        state.update(new PosTaggedToken("did", "VPST"))
        state.update(new PosTaggedToken("not", "NEG"))
        state.update(new PosTaggedToken("order", "V"))
        state.update(new PosTaggedToken("beer", "N"))
        expect(state.value(), endsWith, "DET:N:VPST:NEG:order:beer")
    },

    "does not use POS tags for punctuation"() {
        const state = new PosTaggedState()
        state.update(new PosTaggedToken(",", "PUNCT"))
        expect(state.value(), endsWith, ":,")
    },
})

test("PosTaggedToken", {
    "stringifies to the word it contains"() {
        const token = new PosTaggedToken("the-word", "the-tag")
        expect(token.toString(), is, "the-word")
    },
})

test("tokenizeWithPosTags", {
    "adds part-of-speech tags"() {
        const text = `Data types form the space "between" routines, since data are passed from routine to routine.`
        const tokens = tokenizeWithPosTags(text)
            .map((t) => `${t.word}:${t.tag}`)
        expect(tokens, equals, [
            "Data:NNP",
            " :_",
            "types:NNS",
            " :_",
            "form:NN",
            " :_",
            "the:DT",
            " :_",
            "space:NN",
            " \":_",
            "between:IN",
            "\" :_",
            "routines:NNS",
            ", :_",
            "since:IN",
            " :_",
            "data:NNS",
            " :_",
            "are:VBP",
            " :_",
            "passed:VBN",
            " :_",
            "from:IN",
            " :_",
            "routine:JJ",
            " :_",
            "to:TO",
            " :_",
            "routine:JJ",
            ".:_",
        ])
    },
})

function endsWith(suffix: string, s: string): boolean {
    return s.endsWith(suffix)
}

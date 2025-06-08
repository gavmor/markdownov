import {test, expect, equals} from "@benchristel/taste"
import {tokenize} from "./tokenize.js"

test("tokenize", {
    "emits no tokens given empty text"() {
        const tokens = [...tokenize("")]
        expect(tokens, equals, [])
    },

    "emits one word as a token"() {
        const tokens = [...tokenize("word")]
        expect(tokens, equals, ["word"])
    },

    "emits a space as a token"() {
        const tokens = [...tokenize(" ")]
        expect(tokens, equals, [" "])
    },

    "keeps runs of space together"() {
        const tokens = [...tokenize("   ")]
        expect(tokens, equals, ["   "])
    },

    "keeps a word and following space together"() {
        const tokens = [...tokenize("a ")]
        expect(tokens, equals, ["a "])
    },

    "splits a word and preceding space apart"() {
        const tokens = [...tokenize(" a")]
        expect(tokens, equals, [" ", "a"])
    },

    "separates a sequence of words"() {
        const tokens = [...tokenize("a b c")]
        expect(tokens, equals, ["a ", "b ", "c"])
    },

    "treats punctuation as space"() {
        const tokens = [...tokenize("Hello, world!")]
        expect(tokens, equals, ["Hello, ", "world!"])
    },

    "treats Markdown special characters as space"() {
        const tokens = [...tokenize(" *_-#>`=")]
        expect(tokens, equals, [" *_-#>`="])
    },
})

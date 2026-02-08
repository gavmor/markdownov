import {test, expect, equals} from "@benchristel/taste"
import {DelimiterStack} from "./delimiter-stack.js"
import {tokenizeWithPosTags} from "./pos-tagged-state.js"

function expectStackAfter(input: string, expected: string[]) {
    const tokens = tokenizeWithPosTags(input)
    const stack = new DelimiterStack()
    for (const token of tokens) {
        stack.process(token.toString())
    }
    expect(stack.getDelimiters(), equals, expected)
}

test("DelimiterStack", {
    "starts empty"() {
        const delimiters = new DelimiterStack().getDelimiters()
        expect(delimiters, equals, [])
    },

    "pushes a paren"() {
        expectStackAfter("(", ["("])
    },

    "pops a paren"() {
        expectStackAfter("()", [])
    },

    "pairs delimiters within one token"() {
        const stack = new DelimiterStack()
        stack.process("()(())")
        const delimiters = stack.getDelimiters()
        expect(delimiters, equals, [])
    },

    "stacks unmatched delimiters within one token"() {
        expectStackAfter("{()[", ["{", "["])
    },

    "pops in the presence of unmatched delimiters"() {
        expectStackAfter("( a [ b )", [])
    },

    "only pops until it finds a matching opening delimiter"() {
        expectStackAfter("( a [ b ]", ["("])
    },

    "ignores an unrecognized symbol"() {
        expectStackAfter("%", [])
    },

    "stacks unmatched quotes"() {
        expectStackAfter(`"hello`, [`"`])
    },

    "pairs quotes surrounded by space"() {
        expectStackAfter(` "hello" `, [])
    },

    "pairs quotes without initial space"() {
        expectStackAfter(`"hello!" `, [])
    },

    "pairs quotes without trailing space"() {
        expectStackAfter(` "hello"`, [])
    },

    "pairs curly quotes"() {
        expectStackAfter(`“a”`, [])
    },

    "stacks an unmatched open curly quote"() {
        expectStackAfter(`“a`, [`“`])
    },

    "ignores an unmatched closing curly quote"() {
        expectStackAfter(`a”`, [])
    },

    "handles markdown emphasis"() {
        expectStackAfter("_hello_ ", [])
    },

    "stacks unmatched markdown emphasis"() {
        expectStackAfter("_hello", ["_"])
    },

    "handles markdown strong text"() {
        expectStackAfter("**Hello**, world!", [])
    },

    "handles unmatched markdown strong text"() {
        expectStackAfter("**Hello", ["**"])
    },

    "closes strong text followed by colon"() {
        expectStackAfter("**Hello**:", [])
    },

    "closes strong text around colon"() {
        expectStackAfter("**Hello:**", [])
    },

    "closes strong text followed by period"() {
        expectStackAfter("**Hello**.", [])
    },

    "closes strong text followed by comma"() {
        expectStackAfter("**Hello**,", [])
    },

    "closes strong text followed by bang"() {
        expectStackAfter("**Hello**!", [])
    },

    "closes strong text followed by question mark"() {
        expectStackAfter("**Hello**?", [])
    },

    "handles a complete markdown code block"() {
        expectStackAfter("```\nhello\n```", [])
    },

    "handles a markdown code block with a language tag"() {
        expectStackAfter("```bash\necho hi\n```", [])
    },

    "stacks an unterminated code block"() {
        expectStackAfter("\n```\n    hello\n", ["```"])
    },

    "stacks an unterminated code block with a language tag"() {
        expectStackAfter("```bash\necho hi\n", ["```"])
    },

    "ignores closing delimiters escaped by code blocks"() {
        expectStackAfter("**a\n```**", ["**", "```", "**"])
    },

    "stacks unterminated inline code"() {
        expectStackAfter("`", ["`"])
    },

    "closes inline code"() {
        expectStackAfter("`a`", [])
    },

    "ignores opening markdown delimiters in inline code"() {
        expectStackAfter("` **a`", [])
    },

    "ignores closing markdown delimiters in inline code"() {
        expectStackAfter("**a `b** `", ["**"])
    },

    "processes a Markdown image tag"() {
        expectStackAfter(`![this alt text says "hi"](https://example.com)`, [])
    },

    "in the middle of a Markdown image tag"() {
        expectStackAfter(`![this alt text says "hi"](https://`, ["("])
    },

    "treats snake case as literal, not intra-word emphasis"() {
        expectStackAfter(`snake_case!`, [])
    },

    "treats longer snake case as literal"() {
        expectStackAfter(`one_two_three_four`, [])
    },
})

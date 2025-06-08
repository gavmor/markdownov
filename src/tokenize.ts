const cjkChars = [
    // See: https://www.regular-expressions.info/unicode.html#category
    String.raw`\u2E80-\u2EFF`, // CJK Radicals Supplement
    String.raw`\u3200-\u32FF`, // Enclosed CJK Letters and Months
    String.raw`\u3300-\u33FF`, // CJK Compatibility
    String.raw`\u3400-\u4DBF`, // CJK Unified Ideographs Extension A
    String.raw`\u4E00-\u9FFF`, // CJK Unified Ideographs
    String.raw`\uF900-\uFAFF`, // CJK Compatibility Ideographs
    String.raw`\uFE30-\uFE4F`, // CJK Compatibility Forms
].join("")

const tokenRegex = new RegExp(
    String.raw`^([${cjkChars}]|[0-9\p{L}\p{M}]*)[^0-9\p{L}\p{M}]*`,
    "u", // enable unicode mode
)

export function *tokenize(text: string): Generator<string> {
    let token: string | undefined
    let rest = text
    while (token = rest.match(tokenRegex)?.[0]) {
        yield token
        rest = rest.slice(token.length)
    }
}

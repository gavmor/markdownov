export function repeat<T>(n: number, makeElement: () => T): T[] {
    return new Array(n).fill(undefined).map(makeElement)
}

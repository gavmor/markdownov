export function repeat<T>(n: number, makeElement: () => T): T[] {
    return new Array(n).fill(undefined).map(makeElement)
}

export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
    const len = Math.min(as.length, bs.length)
    const ret: [A, B][] = new Array(len)
    for (let i = 0; i < len; i++) {
        ret[i] = [as[i], bs[i]]
    }
    return ret
}

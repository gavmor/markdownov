import * as Hash from "./hash.js"

export function seedRandom(seed: string): () => number {
    // The sfc32 algorithm
    let [a, b, c, d] = Hash.cyrb128(seed)
    return function rng() {
        const t = (a + b | 0) + d | 0
        d = d + 1 | 0
        a = b ^ b >>> 9
        b = c + (c << 3) | 0
        c = c << 21 | c >>> 11
        c = c + t | 0
        return (t >>> 0) / 4294967296
    }
}

export function pick<T>(rng: () => number, array: T[], defaultValue: T): T {
    return array[Math.floor(rng() * array.length)]
}

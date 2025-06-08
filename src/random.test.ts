import {test, expect, equals, not} from "@benchristel/taste"
import {sfc32} from "./random.js"

test("sfc32", {
    "generates numbers in the interval [0, 1)"() {
        const rng = sfc32("seed")
        for (let i = 0; i < 100; i++) {
            const randomNumber = rng()
            expect(randomNumber, isGreaterThanOrEqualTo, 0)
            expect(randomNumber, isLessThan, 1)
        }
    },

    "generates a variety of numbers"() {
        const rng = sfc32("seed")
        const generated = new Set()
        const iterations = 100
        for (let i = 0; i < iterations; i++) {
            generated.add(rng())
        }
        expect(generated.size, equals, iterations)
    },

    "is deterministic"() {
        const rng1 = sfc32("seed")
        const rng2 = sfc32("seed")
        const iterations = 10
        for (let i = 0; i < iterations; i++) {
            expect(rng1(), equals, rng2())
        }
    },

    "generates different numbers given different seeds"() {
        const rng1 = sfc32("acorn")
        const rng2 = sfc32("bean")
        const iterations = 10
        for (let i = 0; i < iterations; i++) {
            expect(rng1(), not(equals), rng2())
        }
    },
})

function isGreaterThanOrEqualTo(reference: number, subject: number) {
    return subject >= reference
}

function isLessThan(reference: number, subject: number) {
    return subject < reference
}

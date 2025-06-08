import {test, expect, is} from "@benchristel/taste"
import {MarkovModel} from "./markov-model.js"
import {seedRandom} from "../random.js"

test("a MarkovModel", {
    "generates nothing when not trained"() {
        const model = new MarkovModel(seedRandom(""))
        expect(model.generate(), is, "")
    },

    "generates a sequence of tokens based on training data"() {
        const model = new MarkovModel(seedRandom(""))
        model.train("a a a a a")
        expect(model.generate(), is, "a a a a a a a a a")
    },
})

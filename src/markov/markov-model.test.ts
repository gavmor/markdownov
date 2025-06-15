import {test, expect, is} from "@benchristel/taste"
import {MarkovModel} from "./markov-model.js"
import {seedRandom} from "../random.js"
import {Order2} from "./order/order2.js"

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

    "can use an Order2 model"() {
        const model = new MarkovModel(seedRandom(""), new Order2())
        model.train("Haters gonna hate hate hate hate hate")
        model.train("Alligators gonna gate gate gate gate gate")
        model.train("gate gate paragate parasamgate bodhi svaha")
        expect(
            model.generate(),
            is,
            "gate gate gate gate gate gate gate gate paragate parasamgate bodhi svaha",
        )
    },
})

#!/usr/bin/env bun
import * as fs from "fs/promises"
import pos from "pos"
import {MarkovModel} from "../../src/markov/markov-model.js"
import {LossyState} from "../../src/markov/state/lossy-state.js"
import {PosTaggedState, PosTaggedToken} from "../../src/markov/state/pos-tagged-state.js"

const paths = process.argv.slice(2)

const model = new MarkovModel(Math.random, () => new PosTaggedState())

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(tokenize(text))
}

function tokenize(text: string): PosTaggedToken[] {
    const tagger = new pos.Tagger()
    const tokens = text.split(/\b/)
    return tagger.tag(tokens).map(([word, tag]: [string, string]) =>
        new PosTaggedToken(word, tag),
    )
}

function main() {
    return Promise.all(paths.map(trainOn))
        .then(() => console.log(model.generate()))
        .catch(console.error)
}

main()

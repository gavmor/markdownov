#!/usr/bin/env bun
import * as fs from "fs/promises"
import {MarkovModel} from "../../src/markov/markov-model"
import {Lossy} from "../../src/markov/order/lossy"

const paths = process.argv.slice(2)

const model = new MarkovModel(Math.random, new Lossy())

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(text)
}

Promise.all(paths.map(trainOn))
    .then(() => console.log(model.generate()))
    .catch(console.error)

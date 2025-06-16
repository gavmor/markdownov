#!/usr/bin/env bun
import * as fs from "fs/promises"
import {Markdownov} from "../../src/index.js"

const paths = process.argv.slice(2)

const model = new Markdownov()

async function trainOn(path: string): Promise<void> {
    const text = await fs.readFile(path, "utf-8")
    model.train(text)
}

function main() {
    return Promise.all(paths.map(trainOn))
        .then(() => console.log(model.generate()))
        .catch(console.error)
}

main()

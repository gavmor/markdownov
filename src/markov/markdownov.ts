import {seedRandom} from "../random.js"
import {MarkovModel} from "./markov-model.js"
import {PosTaggedState, PosTaggedToken, tokenizeWithPosTags} from "./state/pos-tagged-state.js"

export interface MarkdownovParams {
    /**
     * The seed to initialize the random number generator with. Leave undefined
     * for a random seed.
     */
    seed?: string;
}

export class Markdownov {
    private readonly model: MarkovModel<PosTaggedToken>
    constructor(params: MarkdownovParams = {}) {
        const seed = params.seed ?? String(Math.random())
        this.model = new MarkovModel(
            seedRandom(seed),
            () => new PosTaggedState(),
        )
    }

    train(markdown: string): void {
        this.model.train(tokenizeWithPosTags(markdown))
    }

    generate(maxTokens: number = 100_000): string {
        return this.model.generate(maxTokens)
    }
}

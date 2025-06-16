import {test, expect, is} from "@benchristel/taste"
import {Markdownov} from "./markdownov.js"

const exampleData = `
# Fenimore Cooper's Literary Offenses

By Mark Twain

> The Pathfinder and The Deerslayer stand at the head of Cooper's novels as artistic creations.  There are others of his works which contain parts as perfect as are to be found in these, and scenes even more thrilling.  Not one can be compared with either of them as a finished whole.
>
> The defects in both of these tales are comparatively slight. They were pure works of art.

—Prof. Lounsbury.

> The five tales reveal an extraordinary fulness of invention. ... One of the very greatest characters in fiction, Natty Bumppo....
>
> The craft of the woodsman, the tricks of the trapper, all the delicate art of the forest, were familiar to Cooper from his youth up.

—Prof. Brander Matthews.

> Cooper is the greatest artist in the domain of romantic fiction yet produced by America.

—Wilkie Collins.

It seems to me that it was far from right for the Professor of English Literature in Yale, the Professor of English Literature in Columbia, and Wilkie Collins to deliver opinions on Cooper's literature without having read some of it. It would have been much more decorous to keep silent and let persons talk who have read Cooper. 
`

test("Markdownov", {
    "generates novel Markdown text"() {
        const m = new Markdownov({seed: "1"})
        m.train(exampleData)
        const output = m.generate()
        expect(output, contains, "all the delicate art of the woodsman")
    },

    "generates nothing if not trained"() {
        const m = new Markdownov({seed: "1"})
        const output = m.generate()
        expect(output, is, "")
    },

    "can be initialized without a seed"() {
        new Markdownov()
    },
})

function contains(substring: string, text: string): boolean {
    return text.includes(substring)
}

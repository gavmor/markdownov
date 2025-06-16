# markdownov

A Markdown-aware Markov model for text generation.

## Features

- Intelligently handles markup for `**` **bold** and `_` _italic_ text, links,
  images, headings, lists, and quotes.
- Part-of-speech-aware generator increases output variety while preserving
  (local) grammatical verisimilitude. (English only at the moment.)

## Installation

```sh
# Use your favorite package manager
npm install --save markdownov
pnpm add markdownov
yarn add markdownov
```

## Usage

```ts
import {Markdownov} from "markdownov"

const model = new Markdownov()

// Feed it some training data. One Markdown document per `.train()` call.
model.train("# Hello, world!")
model.train("This is **Markdown**!")

// Generate output.
console.log(model.generate())
```

Optionally, you can seed the random number generator to make Markdownov
deterministic:

```ts
const model = new Markdownov({seed: "some data"})
```

## Sample Output

> The leader, with his blow could fall, and, grasping a handful of death which was by this time, for some of many forms elude all pursuit. In fear I turned, and for a pause, add: “Have not my Jonathan travelled it and wrote of his figure, for it ever saw. I’m not sure, but I have no more, you have seen your true self since last night. You may not wish to know it. I dreamed”—he stopped and seemed fainting, I might not rather have a cat than a gun—a raging madman, with his blow could one know that I have yet attempted. I sat down towards the wind. They drew back amid her body, whilst Art, after I should brave danger and purity and peace everywhere, for we were to run. It is a lot of his wife’s hand grew closer, till his knuckles looked white. It all hurried and bolted. In no place where scarce a knife-blade could have been drained of so much importance individually, would tend to discover. With heavy hearts we came away he became a smart enough fellow, though rough of them and pointed out:—
>
> “Or spiders?” I queried, wishful to get him; instantly, however, she drew them he might have felt terrible fear at seeing anything, then turned the time when I saw our way to Carfax, we came to the dining-room, dimly lit by rays of trees or the crash of gold remained outside.

Trained on [_Dracula_ by Bram Stoker](https://gutenberg.org/cache/epub/345/pg345-images.html), scraped
with the [MarkDownload](https://github.com/deathau/markdownload) add-on for Firefox.

## Development

Dependencies: node 23.11.0, bun 1.2.13, pnpm 9.10.0

```sh
make deps    # one-time setup; installs dependencies and configures git hooks
make test    # run unit tests
make ts      # run the typechecker in watch mode
make lint    # run other static checks
make fix     # fix formatting
make verify  # run all checks
make right   # run all checks and fix formatting (do this before you commit)
make         # same as `make right`
```

The [Husky](https://typicode.github.io/husky/) git hook framework will run
`make right` automatically when you try to commit changes. To bypass this
check, use `git commit -n` or `git commit --no-verify`.

import {tokenize} from "../../tokenize.js"
import {Order, State} from "../types.js"

const END = ""

export class Order2 implements Order<string> {
    textBoundary(): typeof END[] {
        return [END, END]
    }

    initialState(): State<string> {
        return new Order2State()
    }

    tokenize(text: string): string[] {
        return [
            ...this.textBoundary(),
            ...tokenize(text),
            ...this.textBoundary(),
        ]
    }
}

export class Order2State implements State<string> {
    last = END
    lastButOne = END

    id(): string {
        return this.tail().join("")
    }

    update(token: string): void {
        this.lastButOne = this.last
        this.last = token
    }

    tail(): string[] {
        return [this.lastButOne, this.last]
    }
}

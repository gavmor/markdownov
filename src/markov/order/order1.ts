import {tokenize} from "../../tokenize.js"
import {Order, State} from "../types.js"

const END = ""

export class Order1 implements Order<string> {
    textBoundary(): typeof END[] {
        return [END]
    }

    initialState(): State<string> {
        return new Order1State()
    }

    tokenize(text: string): string[] {
        return [
            ...this.textBoundary(),
            ...tokenize(text),
            ...this.textBoundary(),
        ]
    }
}

export class Order1State implements State<string> {
    token = END

    id(): string {
        return this.token
    }

    update(token: string): void {
        this.token = token
    }

    tail(): string[] {
        return [this.token]
    }
}

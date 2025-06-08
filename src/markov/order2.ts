import {Order, State, END} from "./types.js"

export class Order2 implements Order {
    textBoundary(): typeof END[] {
        return [END, END]
    }

    initialState(): State {
        return new Order2State()
    }
}

export class Order2State implements State {
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

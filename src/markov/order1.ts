import {Order, State, END} from "./types.js"

export class Order1 implements Order {
    textBoundary(): typeof END[] {
        return [END]
    }

    initialState(): State {
        return new Order1State()
    }
}

export class Order1State implements State {
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

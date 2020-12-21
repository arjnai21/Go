class GameRequest {

    // usernames
    readonly id: string
    from: string
    to: string

    constructor(from: string, to: string) {
        this.id = `${from.toLowerCase()}-${to.toLowerCase()}`;
        this.to = to;
        this.from = from;
    }
}

export default GameRequest;
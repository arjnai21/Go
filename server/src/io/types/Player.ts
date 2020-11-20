import { Socket } from "socket.io";

class Player {

    public socket: Socket;
    public username: string;
    public inGame: boolean;

    constructor(socket: Socket) {
        this.socket = socket;
        this.inGame = false;
        this.username = "";
    }

    hasUsername() {
        return this.username.length > 0;
    }
}

export default Player;
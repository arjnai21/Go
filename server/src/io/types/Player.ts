import { Socket } from "socket.io";

class Player {

    public socket: Socket;
    public username?: string;
    public inGame: boolean;

    constructor(socket: Socket) {
        this.socket = socket;
        this.inGame = false;
    }

}

export default Player;
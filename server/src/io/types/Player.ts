import { Socket } from "socket.io";

class Player {

    public socket: Socket;
    public username: string;
    public inGame: boolean;
    public gameID: string;
    public color: string;

    constructor(socket: Socket) {
        this.socket = socket;
        this.inGame = false;
        this.username = "";
        this.gameID = "";
        this.color = "";
    }

    hasUsername() {
        return this.username.length > 0;
    }

    setGameId(id: string){
        this.gameID = id;
    }

    setColor(color: string){
        this.color = color;
    }

    getColor(){
        return this.color;
    }
}

export default Player;
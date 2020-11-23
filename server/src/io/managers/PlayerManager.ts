import { Connections } from "../ProtocolManager";
import { Socket } from "socket.io";

class PlayerManager {

    connections: Connections

    constructor(connections: Connections) {
        this.connections = connections;
    }

    setUsername(socket: Socket, username: string): boolean {
        for(const player of Object.values(this.connections)) {
            if(player.hasUsername() && player.username.toLowerCase() === username.toLowerCase()) {
                return false;
            }
        }
        this.connections[socket.id].username = username;
        return true;
    }



}

export default PlayerManager;
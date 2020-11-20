/*
 * Handles All Connections
 */

import Player from "./types/Player";
import { Socket } from "socket.io";
import PlayerManager from "./managers/PlayerManager";
import GameRequestManager from "./managers/GameRequestManager";
import GameManager from "./managers/GameManager";

export interface Connections {
    [key: string]: Player;
}

class ProtocolManager {
    readonly connections: Connections
    // managers
    readonly player: PlayerManager
    readonly gameRequest: GameRequestManager
    readonly game: GameManager

    constructor() {
        this.connections = {};
        this.player = new PlayerManager(this.connections);
        this.gameRequest = new GameRequestManager(this.connections);
        this.game = new GameManager(this.connections);
    }

    getPlayer(socket: Socket): Player {
        return this.connections[socket.id];
    }

    getPlayerByUsername(username: string): Player | null {
        for(const player of Object.values(this.connections)) {
            if(player.hasUsername() && player.username.toLowerCase() === username.toLowerCase()) {
                return player;
            }
        }
        return null;
    }

    addConnection(socket: Socket) {
        this.connections[socket.id] = new Player(socket);
    }

    removeConnection(socket: Socket) {
        delete this.connections[socket.id];
    }

    sendError(socket: Socket, error_message: string) {
        socket.emit('server_client_error', { error_message });
    }

    sendMessage(socket: Socket, message: string) {
        socket.emit('server_message', { message });
    }

}

export default ProtocolManager;
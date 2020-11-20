/*
 * Handles All Connections
 */

import Player from "./types/Player";
import { Socket } from "socket.io";
import PlayerManager from "./managers/PlayerManager";

export interface Connections {
    [key: string]: Player;
}

class ProtocolManager {
    readonly connections: Connections
    readonly player: PlayerManager

    constructor() {
        this.connections = {};
        this.player = new PlayerManager(this.connections);
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
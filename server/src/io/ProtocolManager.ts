/*
 * Handles All Connections
 */

import Player from "./types/Player";
import {Socket} from "socket.io";
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
    gameRequest: GameRequestManager
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
        for (const player of Object.values(this.connections)) {
            if (player.hasUsername() && player.username.toLowerCase() === username.toLowerCase()) {
                return player;
            }
        }
        return null;
    }

    addConnection(socket: Socket) {
        console.log("adding connection");
        this.connections[socket.id] = new Player(socket);
        const keys = Object.keys(this.connections);
        for (let i = 0; i < keys.length; i++) {
            this.connections[keys[i]].socket.emit("server_client_lobby", {
                players: this.gameRequest.getLobbyPlayers(this.connections[keys[i]])
            });
        }
    }

    removeConnection(socket: Socket) {
        //remove socket
        console.log("REMOVING CONNECTION: " + socket.id)
        console.log(this.connections);
        delete this.connections[socket.id];
        console.log("-----------------------------------")
        console.log(this.connections);
        this.broadcastLobby();
    }

    broadcastLobby() {
        const keys = Object.keys(this.connections);
        console.log(keys)
        for (let i = 0; i < keys.length; i++) {
            // console.log("sending lobby to players");
            this.connections[keys[i]].socket.emit("server_client_lobby", {
                    // eslint-disable-next-line max-len
                    players: this.gameRequest.getLobbyPlayers(this.connections[keys[i]])
                }
            );
        }
    }

    sendError(socket: Socket, error_message: string) {
        socket.emit('server_client_error', {error_message});
    }

    sendMessage(socket: Socket, message: string) {
        socket.emit('server_message', {message});
    }

}

export default ProtocolManager;
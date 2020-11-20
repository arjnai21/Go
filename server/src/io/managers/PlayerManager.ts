import { Connections } from "../ProtocolManager";
import { Socket } from "socket.io";

class PlayerManager {

    // TODO: create requests dictionary
    // TODO: Migrate methods to use requests dictionary
    readonly connections: Connections

    constructor(connections: Connections) {
        this.connections = connections;
    }

    getAvailablePlayers(requester: Socket): [string?] {
        const players: [string?] = [];

        for(const player of Object.values(this.connections)) {
            if(player.socket.id !== requester.id && player.username) {
                players.push(player.username);
            }
        }

        return players;
    }

    sendPlayerRequest(from: Socket, to: string): boolean {
        const sender = this.connections[from.id];

        for(const player of Object.values(this.connections)) {
            if(player.username === to) {
                player.socket.emit(
                    'server_client_player_game_request',
                    { invitation_sender_username: sender.username }
                );
                return true;
            }
        }

        return false;
    }

    sendPlayerResponse(from: Socket, to: string, accepted: boolean) {
        const sender = this.connections[from.id];

        for(const player of Object.values(this.connections)) {
            if(player.username === to) {
                player.socket.emit(
                    'server_client_player_game_request',
                    { accepted, from: sender.username }
                );
                return true;
            }
        }

        return false;
    }

    setUsername(socket: Socket, username: string): boolean {
        for(const player of Object.values(this.connections)) {
            if(player.username && player.username.toLowerCase() !== username.toLowerCase()) {
                return false;
            }
        }

        this.connections[socket.id].username = username;
        return true;
    }

}

export default PlayerManager;
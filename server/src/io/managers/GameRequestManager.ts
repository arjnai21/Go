import {Connections} from "../ProtocolManager";
import { CacheClass } from "memory-cache";
import GameRequest from "../types/GameRequest";
import Player from "../types/Player";

// expire after 1 minute(s)
const GAME_REQUEST_TIMEOUT = 60*1000;

class GameRequestManager {

    connections: Connections
    gameRequests: CacheClass<string, GameRequest>

    constructor(connections: Connections) {
        this.connections = connections;
        this.gameRequests = new CacheClass<string, GameRequest>();
    }

    getLobbyPlayers(requester: Player): [string?] {
        const players: [string?] = [];

        for(const player of Object.values(this.connections)) {
            if(player.hasUsername() && player.socket.id !== requester.socket.id) {
                players.push(player.username);
            }
        }

        return players;
    }

    getRequest(id: string): GameRequest | null {
        return this.gameRequests.get(id);
    }

    gameRequestExists(from: Player, to: string): boolean {
        return this.getRequest(new GameRequest(from.username || "", to).id) !== null;
    }

    sendGameRequest(sender: Player, to: string): boolean {
        const request = new GameRequest(sender.username, to);

        for(const player of Object.values(this.connections)) {
            // eslint-disable-next-line max-len
            if(player.hasUsername() && player.username.toLowerCase() === to.toLowerCase() && !player.inGame) {
                player.socket.emit('server_client_game_request', request);
                this.gameRequests.put(request.id, request, GAME_REQUEST_TIMEOUT);
                return true;
            }
        }

        return false;
    }

    removeRequest(id: string) {
        this.gameRequests.del(id);
    }

}

export default GameRequestManager;
/*
 * Handles ALL Game-Related Events
 */

import Player from "../types/Player";
import {Connections} from "../ProtocolManager";

class GameManager {
    connections: Connections;

    constructor(connections: Connections) {
        this.connections = connections;
    }

    // TODO: implement method
    addToGame(player1: Player, player2: Player): boolean {
        return false;
    }

}

export default GameManager;
/*
 * Handles ALL Game-Related Events
 */

import Player from "../types/Player";
import Game from "../types/Game"
import {Move} from "../listeners/GameListener";
import {Connections} from "../ProtocolManager";

class GameManager {
    connections: Connections;
    games: Map<string, Game>;

    constructor(connections: Connections) {
        this.connections = connections;
        this.games = new Map();
    }

    // TODO: implement method
    addToGame(player1: Player, player2: Player): boolean {
        const newGame: Game = new Game(player1, player2);
        const id = newGame.getGameId();
        player1.setGameId(id);
        player1.setColor("W");
        player2.setGameId(id);
        player2.setColor("B");
        this.games.set(id, newGame);
        player1.socket.emit("server_client_game_start",{
            color: player1.color,
            opponent: player2.username,
            gameId: newGame.id,
        });
        player2.socket.emit("server_client_game_start",{
            color: player2.color,
            opponent: player1.username,
            gameId: newGame.id,
        });

        return true;
    }

    playMove(player: Player, move: Move) : any{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const game = this.games.get(player.gameID);
        const response =  game?.playMove(player, move);
        const returnObj = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            board: game.getBoard(),
            moveError: response,
            whiteCaptured: 0,
            blackCaptured: 0,
            currentPlayer: game?.currentPlayer.color
        };
        game?.player1.socket.emit("server_client_move_played", returnObj);
        game?.player2.socket.emit("server_client_move_played", returnObj);



    }

}

export default GameManager;
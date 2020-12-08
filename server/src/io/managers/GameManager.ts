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

    getGame(player: Player): Game | undefined {
        return this.games.get(player.gameID);
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
        if(response == "game_over"){
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line max-len
            const winner:Player = game?.whiteCaptured > game?.blackCaptured ? game.player1 : game.player2;
            this.gameOver(winner);
            return "game_over";
        }
        const returnObj = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            board: game?.getBoard(),
            moveError: response,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            whiteCaptured: game.whiteCaptured,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            blackCaptured: game.blackCaptured,
            currentPlayer: game?.currentPlayer.color
        };
        game?.player1.socket.emit("server_client_move_played", returnObj);
        game?.player2.socket.emit("server_client_move_played", returnObj);
    }

    gameOver(winner: Player, isForfeit= false): boolean {
        // 1. get game
        // 2. remove games from list
        // 3. remove game ids from players
        // 4. send results to both players
        const game = this.games.get(winner.gameID);

        if(!game) {
            // error should be thrown
            return false;
        }

        this.games.delete(game.id);
        game.player1.setGameId("");
        game.player2.setGameId("");

        for(const player of [game.player1, game.player2]) {
            const opponentPlayer = player === game.player1 ? game.player2 : game.player1;

            const opponentUsername = opponentPlayer.username;
            const myCaptured = game.getCapturedPieces(player.color);
            const theirCaptured = game.getCapturedPieces(opponentPlayer.username);

            const returnObj = {
                isForfeit,
                opponentUsername,
                myCaptured,
                theirCaptured,
                win: winner.color
            };
            player.socket.emit('server_client_game_over', returnObj);
            console.log("THIS GAME IS OVER");
        }

        return true;
    }

}

export default GameManager;
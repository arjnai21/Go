/*
 * Player-Related Protocol
 */
import SocketListener from '../types/SocketListener';
import { Socket } from 'socket.io';
import ProtocolManager from "../ProtocolManager";

// Requests

export interface Move {
    x: number,
    y: number
}

// Responses

class GameRequestListener extends SocketListener {

    constructor(socket: Socket, manager: ProtocolManager) {
        super(socket, manager);
    }

    configure() {
        const { socket, manager } = this;
        const me = manager.getPlayer(socket);

        // eslint-disable-next-line max-len
        socket.on("client_server_play_move", function (data: Move){ //TODO ONLY SEND TO THE PERSON WHO DIDNT PLAY WHICH ISNT EVEN THAT HARD TO IMPLEMENT BUT I DIDNT DO IT FOR SOME REASON
            const response : string = manager.game.playMove(me, data);
            const returnObj = {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                board: manager.game.games.get(me.gameID).getBoard(),
                moveError: response,
                whiteCaptured: 0,
                blackCaptured: 0,
            };

            socket.emit("server_client_move_played", returnObj);
        });

        socket.on("client_server_forfeit", function() {
            const game = manager.game.getGame(me);

            if(!game) {
                manager.sendError(me.socket, 'You are not in a game!');
                return;
            }

            const winner = game.player1 === me ? game.player2 : game.player1;
            manager.game.gameOver(winner, true);
        });

    }
}

export default GameRequestListener;
/*
 * Player-Related Protocol
 */
import SocketListener from '../types/SocketListener';
import { Socket } from 'socket.io';
import ProtocolManager from "../ProtocolManager";

// Requests

interface GameRequest {
    username: string
}

interface GameRequestResponse {
    id: string
    accepted: boolean
}

// Responses

class GameRequestListener extends SocketListener {

    constructor(socket: Socket, manager: ProtocolManager) {
        super(socket, manager);
    }

    configure() {
        const { socket, manager } = this;
        const me = manager.getPlayer(socket);

        socket.on('client_server_lobby', function() {
            const players = manager.gameRequest.getLobbyPlayers(me);
            socket.emit('server_client_lobby', { players });
        });

        // player request
        socket.on('client_server_request_user', function(data: GameRequest) {
            if(manager.gameRequest.gameRequestExists(me, data.username)) {
                // eslint-disable-next-line max-len
                manager.sendError(socket, `You already have a pending request to ${data.username}.`);
            } else {
                const wasSent = manager.gameRequest.sendGameRequest(me, data.username);

                if (wasSent) {
                    manager.sendMessage(socket, "Request sent!");
                } else {
                    manager.sendError(socket, "Requested player not found.");
                }
            }
        });

        // player response
        socket.on('client_server_respond_to_request', function(data: GameRequestResponse) {
            const gameRequest = manager.gameRequest.getRequest(data.id);
            let otherPlayer;

            if(!gameRequest) {
                manager.sendError(socket, "Request no longer exists or it has expired.");
            } else if(!(otherPlayer = manager.getPlayerByUsername(gameRequest.from))) {
                manager.sendError(socket, `${gameRequest.from} is no longer online!`);
            } else {
                manager.gameRequest.removeRequest(gameRequest.id);

                if(data.accepted) {
                    // TODO: implement game manager add to game
                    // manager.game.addToGame(me, otherPlayer)

                    // eslint-disable-next-line
                    manager.sendMessage(socket, `Accepted game request from ${otherPlayer.username!}`);
                } else {
                    // eslint-disable-next-line
                    manager.sendMessage(socket, `Denied game request from ${otherPlayer.username!}!`);
                    // eslint-disable-next-line
                    manager.sendMessage(otherPlayer.socket, `${me.username!} has denied your game request!`);
                }
            }
        });
    }
}

export default GameRequestListener;
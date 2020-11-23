/*
 * Player-Related Protocol
 */
import SocketListener from '../types/SocketListener';
import { Socket } from 'socket.io';
import ProtocolManager from "../ProtocolManager";

// Requests

interface UsernameRequest {
    username: string;
}

// Responses

class PlayerListener extends SocketListener {

    constructor(socket: Socket, manager: ProtocolManager) {
        super(socket, manager);
    }

    configure() {
        const { manager, socket } = this;

        // username
        socket.on('client_server_set_username', function(data: UsernameRequest) {
            if(data.username) {
                if(manager.player.setUsername(socket, data.username)) {
                    manager.sendMessage(socket, "Successfully updated username!");
                    const keys = Object.keys(manager.connections);
                    for (let i = 0; i < keys.length; i++) {
                        manager.connections[keys[i]].socket.emit("server_client_lobby", {
                            // eslint-disable-next-line max-len
                                players: manager.gameRequest.getLobbyPlayers(manager.connections[keys[i]])
                            }
                        );
                    }
                } else {
                    manager.sendError(socket, "Username already taken!");
                }
            } else {
                manager.sendError(socket, 'No username provided!');
            }
        });
    }
}

export default PlayerListener;
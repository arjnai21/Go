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
            console.log("username is attempted to be changed");
            if(data.username) {
                if(manager.player.setUsername(socket, data.username)) {
                    manager.sendMessage(socket, "Successfully updated username!");
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
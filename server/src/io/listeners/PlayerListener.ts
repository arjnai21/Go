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

interface UserPlayRequest {
    username: string
}

interface UserPlayResponse {
    sender: string
}

// Responses

class PlayerListener extends SocketListener {

    constructor(socket: Socket, manager: ProtocolManager) {
        super(socket, manager);
    }

    configure() {
        const manager = this.manager;
        const socket = this.socket;

        // username
        socket.on('client_server_set_username', function(data: UsernameRequest) {
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

        // player request
        socket.on('client_server_request_user', function() {

        });

        // player response
        socket.on('client_server_respond_to_request', function() {

        });
    }
}

export default PlayerListener;
import {Server as SocketIOServer, Socket} from "socket.io";
import ProtocolManager from "./ProtocolManager";

// Listeners
import PlayerListener from "./listeners/PlayerListener";

function configureListeners(ioServer: SocketIOServer, manager: ProtocolManager) {
    ioServer.on('connection', function(socket: Socket) {
        manager.addConnection(socket);

        // add listeners
        new PlayerListener(socket, manager);

        socket.on('disconnect', function(socket: Socket) {
           manager.removeConnection(socket);
        });
    });
}

export default configureListeners;
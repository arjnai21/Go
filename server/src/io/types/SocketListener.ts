import {Socket} from 'socket.io';
import ProtocolManager from '../ProtocolManager';

abstract class SocketListener {

    socket: Socket
    manager: ProtocolManager

    protected constructor(socket: Socket, manager: ProtocolManager) {
        this.socket = socket;
        this.manager = manager;
        this.configure();
    }

    // automatically called
    protected abstract configure(): void;
}

export default SocketListener;
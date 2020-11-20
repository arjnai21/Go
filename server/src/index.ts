import './preStart'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';

// Express Server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

// SocketIO Server
import Http from 'http';
import SocketIOServer from 'socket.io';
import ProtocolManager from "./io/ProtocolManager";
import configureListeners from "./io/configureListeners";

const http = new Http.Server(app);
const ioServer = new SocketIOServer(http);
const manager = new ProtocolManager();

configureListeners(ioServer, manager);
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from '../utils/logger';

let io: SocketIOServer | null = null;

export const initWebSocket = (server?: HttpServer) => {
    logger.info('Initializing WebSocket Server...');
    io = new SocketIOServer(server, {
        cors: { 
            origin: '*' ,
            credentials: true,
            methods: ['GET', 'POST'],

        },
        transports: ["websocket"],
    });

    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        socket.on('message', (data) => {
            logger.info(`Message from client: ${data}`);
        });

        socket.on('connect_error', (error) => {
            logger.error(`WebSocket Connection Error: ${error.message}`);
        });

        socket.on('disconnect', (reason) => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    logger.info('WebSocket server initialized');
};

export const emitStatus = (jobId: string, status: string, message?: string) => {
    if (!io) {
        logger.warn('WebSocket server not initialized');
        return;
    }
    io.emit('jobStatus', { jobId, status, message });
};

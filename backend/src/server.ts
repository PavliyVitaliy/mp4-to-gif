import http from 'http';
import app from './app';
import { config } from './config';
import { bridgeQueueStatuses, initWebSocket } from './services/websocketService';
import logger from './utils/logger';

const server = http.createServer(app);

server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
});

initWebSocket(server);
bridgeQueueStatuses();

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});

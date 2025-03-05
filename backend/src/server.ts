import http from 'http';
import app from './app';
import { config } from './config';
import { initWebSocket } from './services/websocketService';
import logger from './utils/logger';

import './workers/videoWorker';

const server = http.createServer(app);

server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
});

initWebSocket(server);

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});
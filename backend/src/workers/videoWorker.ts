import { Worker } from 'bullmq';
import path from 'path';
import { videoQueue, redisConnection } from '../config/redis';
import { emitStatus } from '../services/websocketService';
import logger from '../utils/logger';
import { convertMp4ToGif } from '../services/conversionService';
import { config } from '../config';


redisConnection.ping()
    .then(() => {console.log('Redis connected successfully')})
    .catch((err) => {console.error('Redis connection error:', err)});

const worker = new Worker(
    videoQueue.name,
    async (job) => {
        const jobId = job.id;
        try {
            logger.info(`Processing job ${jobId} with data: ${JSON.stringify(job.data)}`);

            const inputFilePath = job.data.filePath;
            const outputFilePath = path.join(path.dirname(inputFilePath), `${jobId}.gif`);

            emitStatus(jobId!, 'processing', 'Video conversion started');

            await convertMp4ToGif(inputFilePath, outputFilePath);

            emitStatus(jobId!, 'completed', 'GIF conversion successful');

            logger.info(`Job ${jobId} completed successfully`);
        } catch (error) {
            const errorMessage = (error as Error).message;
            emitStatus(job.id!, 'failed', errorMessage);
            logger.error(`Error processing job ${jobId}: ${errorMessage}`);
            throw error;
        }
    },
    { 
        connection: redisConnection,
        stalledInterval: config.JOBS.TTL_STALLED
    }
);

logger.info('Worker started');

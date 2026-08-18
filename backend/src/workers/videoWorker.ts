import { Worker } from 'bullmq';
import path from 'path';
import { videoQueue, redisConnection } from '../config/redis';
import logger from '../utils/logger';
import { convertMp4ToGif } from '../services/conversionService';
import { config } from '../config';
import { removeFile, startFileCleanup } from '../services/fileCleanupService';


redisConnection.ping()
    .then(() => {console.log('Redis connected successfully')})
    .catch((err) => {console.error('Redis connection error:', err)});

new Worker(
    videoQueue.name,
    async (job) => {
        const jobId = job.id;
        try {
            logger.info(`Processing job ${jobId} with data: ${JSON.stringify(job.data)}`);

            const inputFilePath = job.data.filePath;
            const outputFilePath = path.join(path.dirname(inputFilePath), `${jobId}.gif`);

            await convertMp4ToGif(inputFilePath, outputFilePath);
            await removeFile(inputFilePath);

            logger.info(`Job ${jobId} completed successfully`);
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error processing job ${jobId}: ${errorMessage}`);
            throw error;
        }
    },
    { 
        connection: redisConnection,
        stalledInterval: config.JOBS.TTL_STALLED * 1000
    }
);

logger.info('Worker started');
startFileCleanup();

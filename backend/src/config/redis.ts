import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { config } from './index';

export const redisConnection = new Redis({
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    password: config.REDIS.PASSWORD,
    maxRetriesPerRequest: null,
});

export const videoQueue = new Queue('videoQueue', { 
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: { age: config.JOBS.TTL_COMPLETED },
        removeOnFail: { age: config.JOBS.TTL_FAILED }
    }
});

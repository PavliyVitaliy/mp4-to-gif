import dotenv from 'dotenv';

dotenv.config();

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 3000,
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: Number(process.env.REDIS_PORT) || 6379,
        PASSWORD: process.env.REDIS_PASSWORD || undefined,
    },

    VIDEO: {
        MAX_WIDTH: Number(process.env.MAX_VIDEO_WIDTH) || 1024,
        MAX_HEIGHT: Number(process.env.MAX_VIDEO_HEIGHT) || 768,
        MAX_LENGTH: Number(process.env.MAX_VIDEO_LENGTH) || 10, // sec
        GIF_WIDTH: Number(process.env.GIF_WIDTH) || -1,
        GIF_HEIGHT: Number(process.env.GIF_HEIGHT) || 400,
        GIF_FPS: Number(process.env.GIF_FPS) || 5,
    },

    FFMPEG: {
        FPS: 5,
        SIZE: '400x?',
        TIMEOUT: 30000,
    },

    WS_PORT: Number(process.env.WS_PORT) || 8080,

    JOBS: {
        TTL_COMPLETED: Number(process.env.JOB_TTL_COMPLETED) || 86400,
        TTL_FAILED: Number(process.env.JOB_TTL_FAILED) || 86400,
        TTL_STALLED: Number(process.env.JOB_TTL_STALLED) || 600,
    },

    DOCKER: {
        NETWORK: process.env.DOCKER_NETWORK || 'app_network',
    },
};
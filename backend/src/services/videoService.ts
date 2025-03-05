import { UploadedFile } from 'express-fileupload';
import { videoQueue } from '../config/redis';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import { config } from '../config';

const ALLOWED_FORMATS = ['mp4'];

export const processVideo = async (file: UploadedFile) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${Date.now()}_${file.name}`);
    await file.mv(filePath);

    try {
        if (!file) throw new Error('No file uploaded');

        const fileExt = path.extname(file.name).toLowerCase().slice(1)
        if (!ALLOWED_FORMATS.includes(fileExt)) {
            throw new Error(`Invalid file format: ${fileExt}. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`);
        }

        const uploadDir = path.join(__dirname, '..', config.UPLOAD_DIR);
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, `${uuidv4()}.mp4`);
        await file.mv(filePath);

        logger.info(`File uploaded: ${filePath}`);

        const job = await videoQueue.add('convert', { filePath });

        logger.info(`Job added to queue: ${job.id}`);

        return job;
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`Error processing video: ${errorMessage}`);
        throw new Error(`Queue processing failed: ${errorMessage}`);
    }
};

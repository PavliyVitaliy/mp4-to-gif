import { Router, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import logger from '../utils/logger';
import { processVideo } from '../services/videoService';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB limit

export const router = Router();

router.use(fileUpload({
    limits: { fileSize: FILE_SIZE_LIMIT },
    abortOnLimit: true,
}));

/**
 * @openapi
 * /api/upload:
 *   post:
 *     summary: Upload MP4 file for conversion
 *     description: Upload an MP4 file to be converted into a GIF.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded and queued for conversion
 *       400:
 *         description: Invalid input or missing file
 *       413:
 *         description: File too large
 *       500:
 *         description: Internal server error
 */
router.post('/upload', async (req: Request, res: Response): Promise<void> => {
    if (!req.files || !req.files.file) {
        logger.warn('Upload request without a file');
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const video = req.files.file as UploadedFile;

    if (video.mimetype !== 'video/mp4') {
        logger.warn(`Invalid file format: ${video.mimetype}`);
        res.status(400).json({ error: 'Only MP4 files are allowed' });
        return;
    }

    if (video.size > FILE_SIZE_LIMIT) {
        logger.warn('File size exceeds limit');
        res.status(413).json({ error: 'File size exceeds 50MB limit' });
        return;
    }

    try {
        const job = await processVideo(video);
        logger.info(`Video uploaded and job ${job.id} created`);
        res.json({ jobId: job.id });
    } catch (error) {
        logger.error(`Upload error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import logger from '../utils/logger';

export const router = Router();

/**
 * @swagger
 * /api/download/{jobId}:
 *   get:
 *     summary: Download the finished GIF file
 *     description: Allows you to download a GIF file by task ID
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: The file is downloading
 *       404:
 *         description: File not found
 */
router.get('/download/:jobId', (req: Request, res: Response): void => {
    const { jobId } = req.params;

    if (!jobId) {
        logger.warn('Missing jobId in request');
        res.status(400).json({ error: 'Job ID is required' });
        return;
    }

    const filePath = path.join(__dirname, '../uploads', `${jobId}.gif`);

    if (!fs.existsSync(filePath)) {
        logger.warn(`File not found: ${filePath}`);
        res.status(404).json({ error: 'File not found' });
        return;
    }

    logger.info(`Downloading file: ${filePath}`);
    res.download(filePath);
});

import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import logger from '../utils/logger';

const uploadDirectory = () => path.resolve(config.UPLOAD_DIR);

export const removeFile = async (filePath: string): Promise<void> => {
    await fs.rm(filePath, { force: true }).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') logger.warn(`Could not remove ${filePath}: ${error.message}`);
    });
};

export const removeExpiredFiles = async (): Promise<void> => {
    const cutoff = Date.now() - config.FILE_TTL_SECONDS * 1000;
    const entries = await fs.readdir(uploadDirectory(), { withFileTypes: true }).catch(() => []);
    await Promise.all(entries.filter((entry) => entry.isFile()).map(async (entry) => {
        const filePath = path.join(uploadDirectory(), entry.name);
        const stat = await fs.stat(filePath);
        if (stat.mtimeMs < cutoff) await removeFile(filePath);
    }));
};

export const startFileCleanup = (): void => {
    void removeExpiredFiles();
    const timer = setInterval(() => void removeExpiredFiles(), Math.min(config.FILE_TTL_SECONDS * 1000, 60 * 60 * 1000));
    timer.unref();
};

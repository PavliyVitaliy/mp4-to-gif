import * as ffmpeg from 'fluent-ffmpeg';
var ffmpegF = require('fluent-ffmpeg');
import ffmpegStatic from 'ffmpeg-static';
import logger from '../utils/logger';
import fs from 'fs/promises';
import { config } from '../config';

ffmpegF.setFfmpegPath(ffmpegStatic!);

/**
 * Convert an MP4 file to GIF using FFmpeg.
 * @param inputFilePath - Path to the input MP4 file.
 * @param outputFilePath - Path where the output GIF will be saved.
 */
export const convertMp4ToGif = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
    try {
        await fs.access(inputFilePath);

        logger.info(`Starting conversion: ${inputFilePath} -> ${outputFilePath}`);

        await new Promise<void>((resolve, reject) => {
            const process: ffmpeg.FfmpegCommand = ffmpegF(inputFilePath)
                .output(outputFilePath)
                .fps(config.FFMPEG.FPS)
                .size(config.FFMPEG.SIZE)
                .on('end', () => resolve())
                .on('error', (error: Error) => reject(error))
                .run();

            // Timeout in case the process hangs
            setTimeout(() => {
                process.kill('SIGKILL');
                reject(new Error('FFmpeg process timed out'));
            }, config.FFMPEG.TIMEOUT);
        });

        logger.info(`Conversion successful: ${outputFilePath}`);
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`FFmpeg conversion failed: ${errorMessage}`);
        throw new Error(`Failed to convert MP4 to GIF: ${errorMessage}`);
    }
};

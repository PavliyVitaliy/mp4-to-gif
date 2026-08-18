export const validateVideoUpload = (name: string, mimeType: string, size: number): string | undefined => {
    if (mimeType !== 'video/mp4' || !name.toLowerCase().endsWith('.mp4')) {
        return 'Only MP4 files are allowed';
    }

    if (size > 50 * 1024 * 1024) {
        return 'File size exceeds 50MB limit';
    }
};

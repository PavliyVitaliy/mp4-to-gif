import assert from 'node:assert/strict';
import test from 'node:test';
import { validateVideoUpload } from '../services/uploadValidation';

test('accepts an MP4 upload within the configured limit', () => {
    assert.equal(validateVideoUpload('clip.mp4', 'video/mp4', 1024), undefined);
});

test('rejects a disguised or oversized upload', () => {
    assert.equal(validateVideoUpload('clip.exe', 'video/mp4', 1024), 'Only MP4 files are allowed');
    assert.equal(validateVideoUpload('clip.mp4', 'video/mp4', 51 * 1024 * 1024), 'File size exceeds 50MB limit');
});

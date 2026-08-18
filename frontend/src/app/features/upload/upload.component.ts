import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadService } from '../../services/upload.service';
import { WebSocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

const snackBarDuration = 3000;
const maxVideoWidth = 1024;
const maxVideoHeight = 768;
const maxVideoDuration = 10;

@Component({
    selector: 'app-upload',
    standalone: true,
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatButtonModule]
})
export class UploadComponent implements OnDestroy {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    uploadForm: FormGroup;
    selectedFile: File | null = null;
    isUploading = false;
    uploadProgress = 0;
    isDragging = false;
    jobId: string | null = null;
    conversionStatus: 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
    statusMessage = 'Choose a short MP4 video to begin.';
    private statusSubscription?: Subscription;

    constructor(
        private fb: FormBuilder,
        private uploadService: UploadService,
        private webSocketService: WebSocketService,
        private snackBar: MatSnackBar
    ) {
        this.uploadForm = this.fb.group({
            file: [null],
        });
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    onInputFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.processSelectedFile(input.files[0]);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(): void {
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;

        if (event.dataTransfer?.files.length) {
            this.processSelectedFile(event.dataTransfer.files[0]);
        }
    }

    clearFile(): void {
        this.statusSubscription?.unsubscribe();
        this.selectedFile = null;
        this.jobId = null;
        this.conversionStatus = 'pending';
        this.statusMessage = 'Choose a short MP4 video to begin.';
        this.fileInput.nativeElement.value = '';
    }

    ngOnDestroy(): void {
        this.statusSubscription?.unsubscribe();
        this.webSocketService.disconnect();
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            this.snackBar.open('Select file before uploading!', 'OK', { duration: snackBarDuration });
            return;
        }

        this.isUploading = true;
        this.uploadProgress = 0;
        this.conversionStatus = 'processing';
        this.statusMessage = 'Uploading video…';

        this.uploadService.uploadFile(this.selectedFile).subscribe({
            next: (response) => {
                this.jobId = response.jobId;
                this.statusMessage = 'Queued for conversion…';
                this.listenForStatus();
            },
            error: (err) => {
                this.isUploading = false;
                this.conversionStatus = 'failed';
                this.statusMessage = 'Upload failed. Please try another file.';
                this.snackBar.open(`Upload error: ${err.message}`, 'OK', { duration: snackBarDuration });
            },
            complete: () => this.isUploading = false,
        });
    }

    getDownloadUrl(): string {
        return this.jobId ? this.uploadService.downloadFile(this.jobId) : '';
    }

    get canDownload(): boolean {
        return this.conversionStatus === 'completed' && Boolean(this.jobId);
    }

    listenForStatus(): void {
        this.statusSubscription?.unsubscribe();
        this.statusSubscription = this.webSocketService.listenForJobStatus().subscribe((data) => {
            if (data.jobId === this.jobId) {
                this.conversionStatus = data.status as 'processing' | 'completed' | 'failed';
                this.statusMessage = data.message || data.status;
                if (data.status === 'completed') {
                    this.isUploading = false;
                    this.snackBar.open(
                        'Conversion successful! You can now download your GIF.',
                        'OK',
                        { duration: snackBarDuration }
                    );
                    this.statusSubscription?.unsubscribe();
                }
                if (data.status === 'failed') {
                    this.isUploading = false;
                    this.snackBar.open(
                        `Conversion failed: ${data.message}`,
                        'OK',
                        { duration: snackBarDuration }
                    );
                    this.statusSubscription?.unsubscribe();
                }
            }
        });
    }

    private processSelectedFile(file: File): void {
        if (this.selectedFile?.name === file.name) {
            this.snackBar.open('This file is already selected!', 'OK', { duration: snackBarDuration });
            return;
        }

        if (file.type !== 'video/mp4') {
            this.snackBar.open('Only MP4 files are allowed.', 'OK', { duration: snackBarDuration });
            return;
        }

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
            if (video.videoWidth > maxVideoWidth || video.videoHeight > maxVideoHeight) {
                this.snackBar.open(
                    `Video resolution must not exceed ${maxVideoWidth}x${maxVideoHeight}.`,
                    'OK',
                    { duration: snackBarDuration }
                );
                return;
            }

            if (video.duration > maxVideoDuration) {
                this.snackBar.open(
                    `Video must not be longer than ${maxVideoDuration} seconds.`,
                    'OK',
                    { duration: snackBarDuration }
                );
                return;
            }

            this.selectedFile = file;
            this.uploadForm.patchValue({ file });
            this.statusMessage = 'Ready to convert.';
        };
    }
}

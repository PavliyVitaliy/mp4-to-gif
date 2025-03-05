import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private baseUrl = 'http://localhost:3000/api'; //TODO transfer to config

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<{ jobId: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ jobId: string }>(`${this.baseUrl}/upload`, formData);
    }

    downloadFile(jobId: string): string {
        return `${this.baseUrl}/download/${jobId}`;
    }
}

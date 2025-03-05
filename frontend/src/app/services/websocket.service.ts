import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

const SOCKET_RECONNECTION_ATTEMPTS = 5;
const SOCKET_RECONNECTION_DELAY = 2000;
const SOCKET_TIMEOUT = 5000;

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('http://localhost:3000', { //TODO transfer to config
            transports: ['websocket', 'polling'],
            forceNew: true,
            reconnectionAttempts: SOCKET_RECONNECTION_ATTEMPTS,
            timeout: SOCKET_TIMEOUT,
            reconnectionDelay: SOCKET_RECONNECTION_DELAY,
        });
        
        this.socket.on('connect', () => {
            console.log(`WebSocket connected: ${this.socket.id}`);
        });

        this.socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err.message);
        });

        this.socket.on('disconnect', (reason) => {
            console.warn('WebSocket disconnected:', reason);
        });
    }

    listenForJobStatus(): Observable<{ jobId: string, status: string, message?: string }> {
        return new Observable(observer => {
            this.socket.on('jobStatus', (data) => {
                console.log(`Received job update:`, data);
                observer.next(data);
            });
        });
    }

    disconnect(): void {
        console.log('Disconnecting WebSocket...');
        this.socket.disconnect();
    }
}

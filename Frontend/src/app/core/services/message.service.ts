import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageRequestDto, MessageResponseDto, ConversationDto } from '../models/message.model';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = `${environment.apiUrl}/messages`;
    private stompClient: Client | null = null;
    private messageSubject = new BehaviorSubject<MessageResponseDto | null>(null);

    constructor(private http: HttpClient, private authService: AuthService) {
        // Try to connect if user is already logged in
        this.authService.currentUser$.pipe(
            map(user => user ? user.id : null)
        ).subscribe(userId => {
            if (userId) {
                this.connect(Number(userId));
            } else {
                this.disconnect();
            }
        });
    }

    // --- HTTP Methods ---

    sendMessage(request: MessageRequestDto): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(this.apiUrl, request);
    }

    getConversations(): Observable<ConversationDto[]> {
        return this.http.get<ConversationDto[]>(`${this.apiUrl}/conversations`);
    }

    getConversation(conversationId: string, page: number = 0, size: number = 50): Observable<MessageResponseDto[]> {
        return this.http.get<MessageResponseDto[]>(`${this.apiUrl}/conversation/${conversationId}?page=${page}&size=${size}`);
    }

    markAsRead(messageId: number): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(`${this.apiUrl}/${messageId}/read`, {});
    }

    markConversationAsRead(conversationId: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
    }

    // --- WebSocket Methods ---

    public connect(userId: number): void {
        if (this.stompClient && this.stompClient.active) {
            return;
        }

        const socketFactory = () => new SockJS('/ws');

        this.stompClient = new Client({
            webSocketFactory: socketFactory,
            reconnectDelay: 5000,
            debug: (str) => {
                console.log(str);
            },
            onConnect: (frame) => {
                console.log('Connected to WebSocket');

                // Subscribe to user-specific topic
                // Backend sends to /topic/messages/{userId}
                this.stompClient?.subscribe(`/topic/messages/${userId}`, (message: Message) => {
                    if (message.body) {
                        const messageDto: MessageResponseDto = JSON.parse(message.body);
                        this.messageSubject.next(messageDto);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        this.stompClient.activate();
    }

    public disconnect(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
            console.log('Disconnected from WebSocket');
        }
    }

    /**
     * Stream of incoming real-time messages.
     * Components can subscribe to this to update UI.
     */
    public getIncomingMessages(): Observable<MessageResponseDto> {
        return this.messageSubject.asObservable().pipe(
            filter((message): message is MessageResponseDto => message !== null)
        );
    }
}

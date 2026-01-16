import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageResponseDto, MessageRequestDto } from 'src/app/core/models/message.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, OnDestroy {
    @ViewChild(IonContent) content!: IonContent;

    receiverId: number | null = null;
    receiverName: string = 'User'; // Placeholder
    currentUserId: number | null = null;
    conversationId: string | null = null;
    driveId: number | null = null;

    messages: MessageResponseDto[] = [];
    newMessage: string = '';
    isLoading: boolean = true;

    private msgSubscription: Subscription | null = null;

    constructor(
      // eslint-disable-next-line @angular-eslint/prefer-inject
        private route: ActivatedRoute,
      // eslint-disable-next-line @angular-eslint/prefer-inject
        private messageService: MessageService,
      // eslint-disable-next-line @angular-eslint/prefer-inject
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['userId']) {
                this.receiverId = Number(params['userId']);
            }
            if (params['name']) {
                this.receiverName = params['name'];
            }
            if (params['driveId']) {
                this.driveId = Number(params['driveId']);
            }

            this.initChat();
        });

        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUserId = user.id;
                this.initChat();
            }
        });
    }

    ngOnDestroy() {
        if (this.msgSubscription) {
            this.msgSubscription.unsubscribe();
        }
    }

    initChat() {
        if (!this.receiverId && !this.conversationId) {
            // Handle error or wait
            return;
        }

        // Subscribe to real-time messages if not already subscribed
        if (!this.msgSubscription) {
            this.msgSubscription = this.messageService.getIncomingMessages().subscribe(msg => {
                if (this.isMessageRelevant(msg)) {
                    // Prevent duplicates (sender receives their own message via WS too)
                    if (!this.messages.some(m => m.id === msg.id)) {
                        this.messages.push(msg);
                        this.scrollToBottom();
                    }

                    // Mark as read immediately if we are viewing this chat
                    if (this.currentUserId && msg.receiverId === this.currentUserId) {
                        this.messageService.markAsRead(msg.id).subscribe();
                    }
                }
            });
        }


        // Determine conversation ID locally if not provided, or fetch messages
        // Since we might not know conversationId yet, we try to fetch by context or just rely on backend to return history if we had an endpoint for "messages with user X".
        // BUT, the backend API `getConversation` requires `conversationId`.
        // We need to compute it: min(u1, u2)_max(u1, u2) or ..._driveId.
        if (this.currentUserId && this.receiverId) {
            this.conversationId = this.generateConversationId(this.currentUserId, this.receiverId, this.driveId);
            this.loadMessages();
        }
    }

    loadMessages() {
        if (!this.conversationId) return;

        this.isLoading = true;
        this.messageService.getConversation(this.conversationId).subscribe({
            next: (msgs) => {
                this.messages = msgs.reverse(); // Backend returns newest first usually, we want chronological
                this.isLoading = false;
                this.scrollToBottom();
                this.markAllAsRead();
            },
            error: (err) => {
                console.log('Error loading messages or no conversation yet', err);
                this.isLoading = false;
                // It's fine if 404, just means empty chat
            }
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || !this.receiverId) return;

        const request: MessageRequestDto = {
            receiverId: this.receiverId,
            content: this.newMessage
        };

        if (this.driveId) {
            request.driveId = this.driveId;
        }

        this.messageService.sendMessage(request).subscribe({
            next: (msg) => {
                // Check if message was already added via WebSocket
                if (!this.messages.some(m => m.id === msg.id)) {
                    this.messages.push(msg);
                    this.scrollToBottom();
                }
                this.newMessage = '';
            },
            error: (err) => {
                console.error('Failed to send message', err);
            }
        });
    }

    generateConversationId(userId1: number, userId2: number, driveId: number | null): string {
        const min = Math.min(userId1, userId2);
        const max = Math.max(userId1, userId2);
        if (driveId) {
            return `${min}_${max}_${driveId}`;
        }
        return `${min}_${max}`;
    }

    isMessageRelevant(msg: MessageResponseDto): boolean {
        // Check if this message belongs to the current conversation context
        // Ideally compare conversationId
        if (this.conversationId) {
            return msg.conversationId === this.conversationId;
        }
        return false;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.content.scrollToBottom(300);
        }, 100);
    }

    markAllAsRead() {
        if (this.conversationId) {
            this.messageService.markConversationAsRead(this.conversationId).subscribe();
        }
    }
}

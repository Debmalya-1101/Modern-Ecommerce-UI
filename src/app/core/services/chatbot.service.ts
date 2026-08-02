import { Injectable, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ChatbotApiService } from './chatbot-api.service';
import { CartService } from './cart.service';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'BOT';
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly chatbotApi = inject(ChatbotApiService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  private readonly STORAGE_KEY = 'chatbot_messages';

  // State
  readonly isOpen = signal<boolean>(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly isTyping = signal<boolean>(false);

  constructor() {
    // Load from session storage
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        this.messages.set(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse chatbot messages from session storage', e);
      }
    }

    // Save to session storage on every change
    effect(() => {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages()));
    });
  }

  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  openChat(): void {
    this.isOpen.set(true);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  sendMessage(userText: string): void {
    if (!userText.trim()) return;

    // 1. Add user message to UI
    this.messages.update(msgs => [
      ...msgs,
      {
        id: crypto.randomUUID(),
        sender: 'USER',
        text: userText,
        timestamp: new Date()
      }
    ]);

    // 2. Prepare context-aware message payload
    const contextStr = this.getPageContext();
    const payloadMessage = contextStr 
      ? `[Context: ${contextStr}] ${userText}` 
      : userText;

    // 3. Call API
    this.isTyping.set(true);
    this.chatbotApi.sendMessage(payloadMessage)
      .pipe(
        finalize(() => this.isTyping.set(false))
      )
      .subscribe({
        next: (botResponse) => {
          this.messages.update(msgs => [
            ...msgs,
            {
              id: crypto.randomUUID(),
              sender: 'BOT',
              text: botResponse,
              timestamp: new Date()
            }
          ]);
          // Refresh cart — the bot may have added/removed items or placed an order
          this.cartService.loadCart();
        },
        error: (err) => {
          console.error('Chatbot API error:', err);
          this.messages.update(msgs => [
            ...msgs,
            {
              id: crypto.randomUUID(),
              sender: 'BOT',
              text: "Sorry, I couldn't reach the server right now. Please try again later.",
              timestamp: new Date()
            }
          ]);
        }
      });
  }

  private getPageContext(): string | null {
    const url = this.router.url;
    
    // Check if on a product details page (/products/123)
    const productMatch = url.match(/^\/products\/(\d+)$/);
    if (productMatch) {
      return `User is currently viewing Product ID: ${productMatch[1]}`;
    }

    // Check if on an order details page (/orders/123)
    const orderMatch = url.match(/^\/orders\/(\d+)$/);
    if (orderMatch) {
      return `User is currently viewing Order ID: ${orderMatch[1]}`;
    }

    return null;
  }
}

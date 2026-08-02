import { Component, ElementRef, ViewChild, computed, inject, signal, effect, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { ChatbotService } from '../../core/services/chatbot.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { marked } from 'marked';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    DatePipe
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  animations: [
    trigger('chatWindowAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0, transformOrigin: 'bottom right' }),
        animate('280ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(1)', opacity: 1, transformOrigin: 'bottom right' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(0)', opacity: 0, transformOrigin: 'bottom right' }))
      ])
    ])
  ]
})
export class ChatbotComponent implements AfterViewChecked {
  private readonly chatbotService = inject(ChatbotService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  readonly isOpen = this.chatbotService.isOpen;
  readonly messages = this.chatbotService.messages;
  readonly isTyping = this.chatbotService.isTyping;
  readonly unreadCount = computed(() => {
    if (this.isOpen()) return 0;
    // Just an example, can be enhanced to actually track unread
    return 0; 
  });

  userInput = signal('');

  constructor() {
    effect(() => {
      // Whenever chat window opens or messages/typing change, scroll to bottom to show latest message
      const open = this.isOpen();
      const count = this.messages().length;
      const typing = this.isTyping();
      if (open && (count > 0 || typing)) {
        setTimeout(() => this.scrollToBottom(), 50);
        setTimeout(() => this.scrollToBottom(), 250);
      }
    });
  }

  ngAfterViewChecked(): void {
    // Also scroll when view updates if needed, though effect usually handles it
  }

  /** Event delegation for dynamically rendered payment buttons */
  onMessagesClick(event: Event): void {
    const target = event.target as HTMLElement;
    const paymentBtn = target.closest('[data-payment-order-id]') as HTMLElement;
    if (paymentBtn) {
      event.preventDefault();
      const orderId = paymentBtn.getAttribute('data-payment-order-id');
      if (orderId) {
        this.chatbotService.closeChat();
        this.router.navigate(['/payment', orderId]);
      }
    }
  }

  toggleChat(): void {
    this.chatbotService.toggleChat();
  }

  closeChat(): void {
    this.chatbotService.closeChat();
  }

  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const text = this.userInput();
    if (text.trim()) {
      this.chatbotService.sendMessage(text);
      this.userInput.set('');
    }
  }



  parseMessage(text: string): SafeHtml {
    // Parse markdown into HTML synchronously
    let html = marked.parse(text) as string;

    // Transform payment links into in-app buttons
    // The backend might generate markdown links like [Pay Here](/payment/123)
    const paymentRegex = /<a\s+href="[^"]*(?:\/payment\/([\d]+)|\/payment\?orderId=([\d]+))"[^>]*>([^<]+)<\/a>/g;
    html = html.replace(paymentRegex, (match, p1, p2, innerText) => {
      const orderId = p1 || p2;
      return `<a href="javascript:void(0)" class="chat-payment-btn" data-payment-order-id="${orderId}">💳 Proceed to Payment</a>`;
    });

    // Add target="_blank" and class="chat-link" to all other links
    html = html.replace(/<a\s+href="([^"]+)"(?![^>]*class="chat-payment-btn")/g, '<a href="$1" target="_blank" class="chat-link"');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom(): void {
    if (this.scrollContainer?.nativeElement) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}

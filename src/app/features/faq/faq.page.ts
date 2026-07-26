import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqApiService, Faq } from '../../core/services/faq-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss']
})
export class FaqPage implements OnInit {
  private readonly faqService = inject(FaqApiService);
  
  faqs$: Observable<Faq[]> | null = null;
  expandedFaqId: number | null = null;

  ngOnInit(): void {
    this.faqs$ = this.faqService.getFaqs();
  }

  toggleFaq(id: number): void {
    this.expandedFaqId = this.expandedFaqId === id ? null : id;
  }
}

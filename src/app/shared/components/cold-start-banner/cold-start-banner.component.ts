import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cold-start-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cold-start-banner">
      <div class="marquee-content">
        <span class="warning-icon">⏳</span>
        Our backend is waking up! Please wait 2-3 minutes due to the initial cold start on our free hosting. Thank you for your patience!
        <span class="warning-icon">⏳</span>
      </div>
    </div>
  `,
  styles: [`
    .cold-start-banner {
      width: 100%;
      background: linear-gradient(90deg, var(--color-neutral-900, #2d241f), var(--color-neutral-700, #5a473d));
      color: #fff;
      font-weight: 500;
      padding: 10px 0;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 40; /* Just below header */
    }

    .marquee-content {
      display: inline-block;
      padding-left: 100%;
      animation: marquee 20s linear infinite;
    }

    .warning-icon {
      margin: 0 12px;
    }

    @keyframes marquee {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(-100%, 0);
      }
    }
  `]
})
export class ColdStartBannerComponent {}

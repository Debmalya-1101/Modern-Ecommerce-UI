import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: any;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private loadScriptPromise: Promise<void> | null = null;
  private readonly scriptUrl = 'https://checkout.razorpay.com/v1/checkout.js';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  preload(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScript().catch(() => {
        // Silently catch preload errors, allow it to retry on actual click
        this.loadScriptPromise = null;
      });
    }
  }

  private loadScript(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject('Razorpay is only available in browser');
    }

    if (this.loadScriptPromise) {
      return this.loadScriptPromise;
    }

    this.loadScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.scriptUrl;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.loadScriptPromise = null; // allow retry
        reject('Failed to load Razorpay checkout script');
      };
      document.body.appendChild(script);
    });

    return this.loadScriptPromise;
  }

  openCheckout(options: {
    amount: number;
    currency: string;
    orderId: string;
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<RazorpaySuccessResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadScript();

        if (typeof Razorpay === 'undefined') {
          return reject('Razorpay SDK not loaded properly');
        }

        const rzpOptions: RazorpayOptions = {
          key: environment.razorpayKeyId,
          // Amount should be passed in smallest currency unit (e.g., paise). 
          // Since our backend returns amount in INR (rupees), we need to multiply by 100
          // Wait, backend initiate response `amount: 2000` is usually already in Rupees or Paise? 
          // In standard Razorpay, it's Paise. Let's see the order amount. If the order is 2000 INR, it should be 200000 Paise.
          // Let's multiply by 100 just in case. If backend already multiplied it, then amount will be huge.
          // Let's look at `paymentInitiatedAt: "..."`, amount: 2000. `totalAmount: 3500` in order detail.
          // In DTOs: `totalAmount: 3500`. So amount is in RUPEES.
          amount: options.amount * 100,
          currency: options.currency,
          name: 'Modern E-Commerce',
          description: 'Order Payment',
          image: '/assets/logo.png', // Fallback, will show default if not found
          order_id: options.orderId,
          handler: (response: RazorpaySuccessResponse) => {
            this.ngZone.run(() => {
              resolve(response);
            });
          },
          prefill: {
            name: options.name,
            email: options.email,
            contact: options.phone
          },
          theme: {
            color: '#3f51b5'
          },
          modal: {
            ondismiss: () => {
              this.ngZone.run(() => {
                reject('Payment popup closed by user');
              });
            }
          }
        };

        const rzp = new Razorpay(rzpOptions);
        
        rzp.on('payment.failed', (response: any) => {
          // Do not reject the promise here! Razorpay allows the user to retry within the same modal.
          // If we reject, the promise settles and a subsequent success handler won't do anything.
          console.warn('Payment attempt failed', response.error);
        });

        rzp.open();
      } catch (error) {
        reject(error);
      }
    });
  }
}

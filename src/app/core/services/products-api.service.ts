import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { ProductDetail, ProductListItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly apiService = inject(ApiService);
  private readonly products = this.createMockProducts();
  private readonly productDetails = this.createMockProductDetails();

  getProducts(): Observable<ProductListItem[]> {
    return this.apiService.mockData(this.products, {
      delayMs: 350,
      message: 'Mock products loaded successfully.',
      trackLoading: true
    });
  }

  getProductDetail(productId: number): Observable<ProductDetail> {
    const productDetail = this.productDetails.find((product) => product.id === productId);

    if (!productDetail) {
      return this.apiService.mockFailure(`Product #${productId} could not be found.`, 404, {
        delayMs: 300,
        trackLoading: true
      });
    }

    return this.apiService.mockData(productDetail, {
      delayMs: 300,
      message: `Mock product #${productId} loaded successfully.`,
      trackLoading: true
    });
  }

  private createMockProducts(): ProductListItem[] {
    return [
      {
        id: 101,
        name: 'Luma Carry Pro Backpack',
        price: 3299,
        originalPrice: 4499,
        imageUrl: '',
        imageLabel: 'Travel backpack',
        rating: 4.6,
        reviewCount: 184,
        active: true,
        brand: 'Northline',
        categoryName: 'Backpacks',
        badge: 'Best Seller',
        shortDescription: 'A clean travel-ready backpack with padded storage and everyday organization.'
      },
      {
        id: 102,
        name: 'Aero Noise-Lite Headphones',
        price: 8999,
        originalPrice: 10999,
        imageUrl: '',
        imageLabel: 'Wireless headphones',
        rating: 4.4,
        reviewCount: 92,
        active: true,
        brand: 'Sonica',
        categoryName: 'Electronics'
      },
      {
        id: 103,
        name: 'Oak & Ember Desk Lamp',
        price: 2199,
        originalPrice: 2899,
        imageUrl: '',
        imageLabel: 'Desk lamp',
        rating: 4.3,
        reviewCount: 48,
        active: true,
        brand: 'Hearth Studio',
        categoryName: 'Home',
        badge: 'Editor Pick',
        shortDescription: 'Warm ambient light for compact desks, reading corners, and calm evening setups.'
      },
      {
        id: 104,
        name: 'Stride Everyday Sneakers',
        price: 4299,
        originalPrice: 5499,
        imageUrl: '',
        imageLabel: 'Sneakers',
        rating: 4.5,
        reviewCount: 126,
        active: true,
        brand: 'Motive',
        categoryName: 'Footwear',
        shortDescription: 'Minimal low-top sneakers designed for lightweight comfort and all-day wear.'
      }
    ];
  }

  private createMockProductDetails(): ProductDetail[] {
    return [
      {
        id: 101,
        name: 'Luma Carry Pro Backpack',
        description: 'A polished everyday backpack with organized compartments, padded laptop storage, and a travel-friendly silhouette.',
        price: 3299,
        originalPrice: 4499,
        imageUrl: '',
        imageLabel: 'Travel backpack',
        rating: 4.6,
        reviewCount: 184,
        active: true,
        brand: 'Northline',
        categoryName: 'Backpacks',
        badge: 'Best Seller',
        imageGallery: [],
        specifications: [
          { key: 'Material', value: 'Water-resistant woven fabric' },
          { key: 'Capacity', value: '22 liters' },
          { key: 'Best for', value: 'Daily commute and short travel' }
        ]
      },
      {
        id: 102,
        name: 'Aero Noise-Lite Headphones',
        description: 'Comfort-first wireless headphones with balanced sound, long battery life, and a clean modern finish.',
        price: 8999,
        originalPrice: 10999,
        imageUrl: '',
        imageLabel: 'Wireless headphones',
        rating: 4.4,
        reviewCount: 92,
        active: true,
        brand: 'Sonica',
        categoryName: 'Electronics',
        badge: 'New Arrival',
        imageGallery: [],
        specifications: [
          { key: 'Battery life', value: '32 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.3' },
          { key: 'Best for', value: 'Work, travel, and calls' }
        ]
      },
      {
        id: 103,
        name: 'Oak & Ember Desk Lamp',
        description: 'A compact desk lamp with warm tones and simple controls for focused work and softer evening light.',
        price: 2199,
        originalPrice: 2899,
        imageUrl: '',
        imageLabel: 'Desk lamp',
        rating: 4.3,
        reviewCount: 48,
        active: true,
        brand: 'Hearth Studio',
        categoryName: 'Home',
        badge: 'Editor Pick',
        imageGallery: [],
        specifications: [
          { key: 'Light tone', value: 'Warm white' },
          { key: 'Power', value: 'USB-C powered' },
          { key: 'Best for', value: 'Home office and bedside use' }
        ]
      },
      {
        id: 104,
        name: 'Stride Everyday Sneakers',
        description: 'Low-profile sneakers with breathable lining and a versatile shape that works across casual everyday outfits.',
        price: 4299,
        originalPrice: 5499,
        imageUrl: '',
        imageLabel: 'Sneakers',
        rating: 4.5,
        reviewCount: 126,
        active: true,
        brand: 'Motive',
        categoryName: 'Footwear',
        imageGallery: [],
        specifications: [
          { key: 'Upper', value: 'Breathable knit blend' },
          { key: 'Sole', value: 'Flexible rubber outsole' },
          { key: 'Best for', value: 'Daily wear and city walking' }
        ]
      }
    ];
  }
}

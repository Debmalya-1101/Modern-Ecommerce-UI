import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { ProductDetail, ProductListItem } from '../models/product.model';

export type ProductCatalogPreviewState = 'live' | 'empty' | 'error';

export interface ProductCatalogQuery {
  searchTerm?: string;
  category?: string;
  badge?: string;
  previewState?: ProductCatalogPreviewState;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly apiService = inject(ApiService);
  private readonly products = this.createMockProducts();
  private readonly productDetails = this.createMockProductDetails();

  getCatalogCategories(): string[] {
    return Array.from(
      new Set(this.products.map((product) => product.categoryName))
    ).sort((left, right) => left.localeCompare(right));
  }

  getProducts(query?: ProductCatalogQuery): Observable<ProductListItem[]> {
    if (query?.previewState === 'error') {
      return this.apiService.mockFailure('Catalog preview error: unable to load products right now.', 500, {
        delayMs: 650,
        trackLoading: true
      });
    }

    const filteredProducts = this.filterProducts(query);
    const productsToReturn = query?.previewState === 'empty' ? [] : filteredProducts;

    return this.apiService.mockData(productsToReturn, {
      delayMs: 650,
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
        badge: 'Sale',
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
        categoryName: 'Electronics',
        badge: 'New',
        shortDescription: 'Lightweight wireless audio with soft ear cushions and commute-friendly battery life.'
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
        badge: 'Sale',
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
        badge: 'New',
        shortDescription: 'Minimal low-top sneakers designed for lightweight comfort and all-day wear.'
      },
      {
        id: 105,
        name: 'Cove Ceramic Brew Set',
        price: 2599,
        originalPrice: 3199,
        imageUrl: '',
        imageLabel: 'Coffee brew set',
        rating: 4.7,
        reviewCount: 61,
        active: true,
        brand: 'Atelier Brew',
        categoryName: 'Kitchen',
        badge: 'Sale',
        shortDescription: 'Stone-finish pour-over set built for slow mornings and compact countertops.'
      },
      {
        id: 106,
        name: 'Nova Fit Smart Watch',
        price: 12499,
        originalPrice: 14999,
        imageUrl: '',
        imageLabel: 'Smart watch',
        rating: 4.5,
        reviewCount: 205,
        active: true,
        brand: 'PulseWare',
        categoryName: 'Wearables',
        badge: 'New',
        shortDescription: 'Fitness tracking, message previews, and a bright face that stays readable outdoors.'
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
        badge: 'Sale',
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
        badge: 'New',
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
        badge: 'Sale',
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
      },
      {
        id: 105,
        name: 'Cove Ceramic Brew Set',
        description: 'A compact ceramic brew kit with a dripper, mug, and textured finish that looks premium on open shelves.',
        price: 2599,
        originalPrice: 3199,
        imageUrl: '',
        imageLabel: 'Coffee brew set',
        rating: 4.7,
        reviewCount: 61,
        active: true,
        brand: 'Atelier Brew',
        categoryName: 'Kitchen',
        badge: 'Sale',
        imageGallery: [],
        specifications: [
          { key: 'Finish', value: 'Matte ceramic glaze' },
          { key: 'Included', value: 'Dripper, server mug, and lid' },
          { key: 'Best for', value: 'Coffee corners and gifting' }
        ]
      },
      {
        id: 106,
        name: 'Nova Fit Smart Watch',
        description: 'A slim smartwatch with health tracking, bright display, and everyday durability for active routines.',
        price: 12499,
        originalPrice: 14999,
        imageUrl: '',
        imageLabel: 'Smart watch',
        rating: 4.5,
        reviewCount: 205,
        active: true,
        brand: 'PulseWare',
        categoryName: 'Wearables',
        badge: 'New',
        imageGallery: [],
        specifications: [
          { key: 'Battery life', value: 'Up to 7 days' },
          { key: 'Water resistance', value: '5 ATM' },
          { key: 'Best for', value: 'Workouts, walking, and notifications' }
        ]
      }
    ];
  }

  private filterProducts(query?: ProductCatalogQuery): ProductListItem[] {
    const normalizedSearchTerm = query?.searchTerm?.trim().toLowerCase() ?? '';
    const normalizedCategory = query?.category?.trim().toLowerCase() ?? '';
    const normalizedBadge = query?.badge?.trim().toLowerCase() ?? '';

    return this.products.filter((product) => {
      const matchesSearch = !normalizedSearchTerm
        || product.name.toLowerCase().includes(normalizedSearchTerm)
        || product.brand.toLowerCase().includes(normalizedSearchTerm)
        || product.categoryName.toLowerCase().includes(normalizedSearchTerm)
        || product.shortDescription?.toLowerCase().includes(normalizedSearchTerm);
      const matchesCategory = !normalizedCategory
        || product.categoryName.toLowerCase() === normalizedCategory;
      const matchesBadge = !normalizedBadge
        || (product.badge?.toLowerCase() ?? '') === normalizedBadge;

      return matchesSearch && matchesCategory && matchesBadge;
    });
  }
}

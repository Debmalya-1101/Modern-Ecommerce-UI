import { Injectable, inject } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, groupBy, mergeMap, switchMap, tap } from 'rxjs/operators';

import { CartApiService } from './cart-api.service';
import { Cart } from '../models/cart.model';

export interface QuantityUpdateRequest {
  itemId: number;
  quantity: number;
  onSuccess: (cart: Cart) => void;
  onError: (error: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class CartRequestQueueService {
  private readonly cartApi = inject(CartApiService);
  private readonly updateSubject = new Subject<QuantityUpdateRequest>();

  constructor() {
    this.updateSubject.pipe(
      // Group rapid requests by item ID so they are debounced independently
      groupBy(req => req.itemId),
      mergeMap(group$ => group$.pipe(
        // Wait 400ms after the last click before firing the API request
        debounceTime(400),
        switchMap(req => 
          this.cartApi.updateItemQuantity(req.itemId, req.quantity).pipe(
            tap(cart => req.onSuccess(cart)),
            catchError(err => {
              req.onError(err);
              return of(null); // Catch error to keep the stream alive
            })
          )
        )
      ))
    ).subscribe();
  }

  public enqueueQuantityUpdate(req: QuantityUpdateRequest): void {
    this.updateSubject.next(req);
  }
}

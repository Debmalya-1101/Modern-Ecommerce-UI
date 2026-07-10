import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColdStartService {
  readonly isColdStarting = signal<boolean>(false);

  setColdStarting(state: boolean): void {
    this.isColdStarting.set(state);
  }
}

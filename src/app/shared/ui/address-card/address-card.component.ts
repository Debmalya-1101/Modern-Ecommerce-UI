import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Address } from '../../../core/models/address.model';

@Component({
  selector: 'app-address-card',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss'
})
export class AddressCardComponent {
  @Input({ required: true }) address!: Address;
  @Input() selectable = false;
  @Input() selected = false;

  @Output() edit = new EventEmitter<Address>();
  @Output() delete = new EventEmitter<number>();
  @Output() setDefault = new EventEmitter<number>();
  @Output() select = new EventEmitter<Address>();

  protected onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.address);
  }

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();
    if (this.address.id) {
      this.delete.emit(this.address.id);
    }
  }

  protected onSetDefault(event: MouseEvent): void {
    event.stopPropagation();
    if (this.address.id) {
      this.setDefault.emit(this.address.id);
    }
  }

  protected onSelect(): void {
    if (this.selectable) {
      this.select.emit(this.address);
    }
  }
}

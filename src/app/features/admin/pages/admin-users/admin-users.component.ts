import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { AdminUsersService } from '../../../../core/services/admin-users.service';
import { AdminUserDTO } from '../../../../core/models/admin-users.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmationDialogComponent } from '../../../../shared/ui/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    DatePipe
  ],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.scss']
})
export class AdminUsersComponent implements OnInit {
  private readonly usersService = inject(AdminUsersService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns: string[] = ['id', 'user', 'role', 'active', 'joined', 'actions'];

  readonly users = signal<AdminUserDTO[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Per-user loading state for toggle
  readonly togglingUserId = signal<number | null>(null);

  // Pagination
  protected totalElements = signal(0);
  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  // Filters
  protected roleFilter = signal<string>('ALL');
  protected statusFilter = signal<string>('ALL');
  protected searchFilter = signal<string>('');

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const searchTerm = this.searchFilter().trim() || undefined;

    this.usersService.getUsers(
      this.pageIndex(),
      this.pageSize(),
      searchTerm,
      this.roleFilter() === 'ALL' ? undefined : this.roleFilter(),
      this.statusFilter() === 'ALL' ? undefined : this.statusFilter() === 'ACTIVE'
    )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (pageResponse) => {
          this.users.set(pageResponse.content);
          this.totalElements.set(pageResponse.totalElements);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load users');
        }
      });
  }

  onRoleFilterChange(value: string): void {
    this.roleFilter.set(value);
    this.pageIndex.set(0);
    this.loadUsers();
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value);
    this.pageIndex.set(0);
    this.loadUsers();
  }

  onSearchChange(value: string): void {
    this.searchFilter.set(value);
    this.pageIndex.set(0);
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchFilter.set('');
    this.roleFilter.set('ALL');
    this.statusFilter.set('ALL');
    this.pageIndex.set(0);
    this.loadUsers();
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN': return 'role-admin';
      case 'ROLE_DELIVERY_PARTNER': return 'role-delivery';
      default: return 'role-user';
    }
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '').replace('_', ' ');
  }

  isToggling(userId: number): boolean {
    return this.togglingUserId() === userId;
  }

  onStatusToggle(user: AdminUserDTO, toggle: MatSlideToggle): void {
    const targetActiveState = toggle.checked;
    const action = targetActiveState ? 'activate' : 'deactivate';
    const userName = user.userName || user.emailId;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'app-dialog-container',
      data: {
        title: `${targetActiveState ? 'Activate' : 'Deactivate'} User`,
        message: `Are you sure you want to ${action} <strong>${userName}</strong>?`,
        confirmLabel: targetActiveState ? 'Activate' : 'Deactivate',
        cancelLabel: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        // Revert the toggle visually immediately using the component reference!
        toggle.checked = user.active;
        return;
      }

      // Show per-user loader in the table cell
      this.togglingUserId.set(user.id);

      this.usersService.updateUserStatus(user.id, targetActiveState)
        .pipe(finalize(() => this.togglingUserId.set(null)))
        .subscribe({
          next: () => {
            this.snackbarService.success(`User ${targetActiveState ? 'activated' : 'deactivated'} successfully`);
            // Loading users from backend will update the model, naturally reflecting the new toggle state
            this.loadUsers();
          },
          error: (err) => {
            this.snackbarService.error(err.error?.message || 'Failed to update user status');
            // Revert on API error
            toggle.checked = user.active;
          }
        });
    });
  }

  updateRole(user: AdminUserDTO, newRole: string): void {
    if (user.role === newRole) return;

    this.isLoading.set(true);
    this.usersService.updateUserRole(user.id, newRole)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.snackbarService.success(`User role updated to ${newRole}`);
          this.loadUsers();
        },
        error: (err) => {
          this.snackbarService.error(err.error?.message || 'Failed to update user role');
        }
      });
  }
}

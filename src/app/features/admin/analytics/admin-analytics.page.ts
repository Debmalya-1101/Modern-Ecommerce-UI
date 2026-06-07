import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';

import { AdminAnalyticsService } from '../../../core/services/admin-analytics.service';
import { DashboardAnalyticsDTO } from '../../../core/models/admin-analytics.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-analytics',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: './admin-analytics.page.html',
  styleUrl: './admin-analytics.page.scss'
})
export class AdminAnalyticsPage implements OnInit {
  private readonly analyticsService = inject(AdminAnalyticsService);

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  protected readonly data = signal<DashboardAnalyticsDTO | null>(null);
  protected readonly displayedColumns: string[] = ['rank', 'name', 'units', 'revenue', 'rating'];
  
  private salesChartInstance: Chart | null = null;
  private statusChartInstance: Chart | null = null;

  ngOnInit(): void {
    this.analyticsService.getDashboardAnalytics().subscribe((response) => {
      this.data.set(response);
      // Slight delay to ensure *ngIf/canvas elements are rendered by Angular before Chart.js binds
      setTimeout(() => this.initializeCharts(response), 0);
    });
  }

  private initializeCharts(data: DashboardAnalyticsDTO): void {
    if (!this.salesChartRef || !this.statusChartRef) {
      return;
    }

    if (this.salesChartInstance) this.salesChartInstance.destroy();
    if (this.statusChartInstance) this.statusChartInstance.destroy();

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    const salesWithYear = data.monthlySalesGraph.map((s) => {
      const year = s.month > currentMonth ? currentYear - 1 : currentYear;
      return { ...s, year };
    });

    // Sort to ensure months are plotted chronologically
    const sortedSales = salesWithYear.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });
    
    this.salesChartInstance = new Chart(this.salesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: sortedSales.map((s) => `${monthLabels[s.month - 1]} ${s.year}`),
        datasets: [
          {
            label: 'Total Revenue (INR)',
            data: sortedSales.map((s) => s.totalRevenue),
            backgroundColor: 'rgba(33, 43, 54, 0.8)',
            yAxisID: 'y'
          },
          {
            label: 'Total Orders',
            data: sortedSales.map((s) => s.totalOrders),
            type: 'line',
            borderColor: '#00a76f',
            backgroundColor: '#00a76f',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

    const statusLabels = data.ordersByStatus.map(s => s.status);
    const statusData = data.ordersByStatus.map(s => s.count);
    const statusColors = data.ordersByStatus.map(s => {
      switch (s.status) {
        case 'PLACED': return '#1890ff';
        case 'SHIPPED': return '#faad14';
        case 'DELIVERED': return '#52c41a';
        case 'CANCELLED': return '#f5222d';
        default: return '#8c8c8c';
      }
    });

    this.statusChartInstance = new Chart(this.statusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusData,
          backgroundColor: statusColors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

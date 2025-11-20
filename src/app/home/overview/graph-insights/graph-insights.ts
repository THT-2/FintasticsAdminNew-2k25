import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-graph-insights',
  templateUrl: './graph-insights.html',
  styleUrls: ['./graph-insights.scss']
})
export class GraphInsights implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderDailyChart();
      this.renderMonthlyChart();
      this.setupDownloadButtons();
    }
  }

  // ===== Helper Methods =====
  private downloadBlob(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private getText(el: HTMLElement | null): string {
    return el?.textContent?.trim() ?? '';
  }

  private buildCsv(): string {
    const rows: string[][] = [];
    rows.push(['Section', 'Metric', 'Value']);

    const androidMetrics = {
      total: this.getText(document.getElementById('android-total')),
      newUsers: this.getText(document.querySelector('#android-new span')),
      deletedUsers: this.getText(document.querySelector('#android-deleted span')),
      allUsers: this.getText(document.querySelector('#android-all span')),
      delta: this.getText(document.querySelector('#android-total-delta span')),
    };

    const iosMetrics = {
      total: this.getText(document.getElementById('ios-total')),
      newUsers: this.getText(document.querySelector('#ios-new span')),
      deletedUsers: this.getText(document.querySelector('#ios-deleted span')),
      allUsers: this.getText(document.querySelector('#ios-all span')),
      delta: this.getText(document.querySelector('#ios-total-delta span')),
    };

    // Android rows
    rows.push(['Android', 'Total', androidMetrics.total]);
    rows.push(['Android', 'New Users', androidMetrics.newUsers]);
    rows.push(['Android', 'Deleted Users', androidMetrics.deletedUsers]);
    rows.push(['Android', 'All Users', androidMetrics.allUsers]);
    rows.push(['Android', 'Δ %', androidMetrics.delta]);

    // iOS rows
    rows.push(['iOS', 'Total', iosMetrics.total]);
    rows.push(['iOS', 'New Users', iosMetrics.newUsers]);
    rows.push(['iOS', 'Deleted Users', iosMetrics.deletedUsers]);
    rows.push(['iOS', 'All Users', iosMetrics.allUsers]);
    rows.push(['iOS', 'Δ %', iosMetrics.delta]);

    return rows
      .map(r => r.map(x => `"${String(x).replaceAll('"', '""')}"`).join(','))
      .join('\n');
  }

  // ===== Setup Download Buttons =====
  private setupDownloadButtons(): void {
    const downloadCsvBtn = document.getElementById('downloadCsvBtn');
    const downloadCsvBtn2 = document.getElementById('downloadCsvBtn2');
    const downloadDailyPng = document.getElementById('downloadDailyPng');
    const downloadMonthlyPng = document.getElementById('downloadMonthlyPng');

    downloadCsvBtn?.addEventListener('click', () => {
      this.downloadBlob(this.buildCsv(), 'dashboard-export.csv', 'text/csv');
    });

    downloadCsvBtn2?.addEventListener('click', () => {
      this.downloadBlob(this.buildCsv(), 'dashboard-export.csv', 'text/csv');
    });

    downloadDailyPng?.addEventListener('click', () => {
      const dailyChartInstance = (window as any).dailyChartInstance;
      if (dailyChartInstance) {
        const uri: string = dailyChartInstance.toBase64Image();
        const a = document.createElement('a');
        a.href = uri;
        a.download = 'daily-chart.png';
        a.click();
      }
    });

    downloadMonthlyPng?.addEventListener('click', () => {
      const monthlyChartInstance = (window as any).monthlyChartInstance;
      if (monthlyChartInstance) {
        const uri: string = monthlyChartInstance.toBase64Image();
        const a = document.createElement('a');
        a.href = uri;
        a.download = 'monthly-chart.png';
        a.click();
      }
    });
  }

  // ===== Chart Rendering =====
  private renderDailyChart(): void {
    const canvas = document.getElementById('dailyChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Registered', data: [32, 45, 50, 60, 70, 90, 100], backgroundColor: 'rgba(90, 79, 207, 0.7)' },
          { label: 'Active', data: [28, 35, 40, 55, 65, 80, 95], backgroundColor: 'rgba(0, 123, 255, 0.5)' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#333' } } },
        scales: {
          x: { ticks: { color: '#333' } },
          y: { beginAtZero: true, ticks: { color: '#333' } }
        }
      }
    });

    (window as any).dailyChartInstance = chart;
  }

  private renderMonthlyChart(): void {
    const canvas = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          { label: 'Registered', data: [300, 320, 330, 310, 350, 370, 400], backgroundColor: 'rgba(90, 79, 207, 0.7)' },
          { label: 'Active', data: [250, 280, 290, 270, 300, 340, 360], backgroundColor: 'rgba(0, 123, 255, 0.5)' },
          { label: 'Deleted', data: [30, 25, 20, 28, 35, 40, 38], backgroundColor: 'rgba(220, 53, 69, 0.6)' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#333' } } },
        scales: {
          x: { ticks: { color: '#333' } },
          y: { beginAtZero: true, ticks: { color: '#333' } }
        }
      }
    });

    (window as any).monthlyChartInstance = chart;
  }

}

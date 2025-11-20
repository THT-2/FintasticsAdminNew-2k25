import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, PieController, DoughnutController, LineController, BarController,
         ArcElement, BarElement, PointElement, LineElement, CategoryScale, LinearScale,
         Title, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js controllers and elements
Chart.register(
  PieController, DoughnutController, LineController, BarController,
  ArcElement, BarElement, PointElement, LineElement,
  CategoryScale, LinearScale,
  Title, Tooltip, Legend, Filler
);

interface Goal {
  category: string;
  status: 'completed' | 'abandoned' | 'in-progress';
  targetAmount: number;
  start: Date;
  completedAt?: Date;
}

interface ChartsMap {
  topCategories?: Chart;
  catSuccess?: Chart;
  amountDuration?: Chart;
  achieverSplit?: Chart;
  retention?: Chart;
  successGauge?: Chart;
  hotspots?: Chart;
  hourly?: Chart;
}

@Component({
  selector: 'app-fin-category',
  templateUrl: './fin-category.html',
  styleUrls: ['./fin-category.scss']
})
export class FinCategory implements AfterViewInit {

  charts: ChartsMap = {};

  // Canvas references
  @ViewChild('chartTopCategories') chartTopCategories!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCatSuccess') chartCatSuccess!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAmountDuration') chartAmountDuration!: ElementRef<HTMLCanvasElement>;

  // Sample countries
  countries: string[] = ['India', 'USA', 'UK', 'Germany', 'France'];

  ngAfterViewInit(): void {
    this.initCharts();
  }

  private initCharts(): void {

    // --- Top Categories Pie Chart ---
    this.charts['topCategories'] = new Chart(this.chartTopCategories.nativeElement, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: ['#7c3aed','#22c1c3','#16a34a','#ef4444','#0ea5e9','#6A4C93','#6b7280'] }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // --- Category Success Bar Chart ---
    this.charts['catSuccess'] = new Chart(this.chartCatSuccess.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          { label: 'Completed', data: [], backgroundColor: '#16a34a', type: 'bar' },
          { label: 'Abandoned', data: [], backgroundColor: '#ef4444', type: 'bar' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }
    });

    // --- Amount vs Duration Mixed Chart ---
    this.charts['amountDuration'] = new Chart(this.chartAmountDuration.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          { label: 'Avg Amount (₹)', data: [], backgroundColor: '#0ea5e9', yAxisID: 'y', type: 'bar' },
          { label: 'Avg Duration (days)', data: [], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.15)', yAxisID: 'y1', type: 'line', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { type: 'linear', position: 'left', title: { display: true, text: 'Amount (₹)' }, beginAtZero: true },
          y1: { type: 'linear', position: 'right', title: { display: true, text: 'Days' }, grid: { drawOnChartArea: false }, beginAtZero: true }
        }
      }
    });
  }
}

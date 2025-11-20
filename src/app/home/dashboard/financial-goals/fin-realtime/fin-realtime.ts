import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ----- Type Definitions -----
interface User {
  id: string | number;
  name: string;
  country?: string;
}

interface Goal {
  id: string | number;
  userId: string | number;
  category: string;
  title: string;
}

interface GoalEvent {
  ts: Date;
  userId: string | number;
  info: string;
}

@Component({
  selector: 'app-fin-realtime',
  templateUrl: './fin-realtime.html',
  styleUrls: ['./fin-realtime.scss']
})
export class FinRealtime implements AfterViewInit {

  @ViewChild('chartHotspots') chartHotspotsRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartHourly') chartHourlyRef!: ElementRef<HTMLCanvasElement>;

  charts: { hotspots: Chart | null; hourly: Chart | null } = { hotspots: null, hourly: null };

  users: User[] = [];      // populate externally
  countries: string[] = []; // populate externally

  ngAfterViewInit() {
    // --- Hotspots chart ---
    this.charts.hotspots = new Chart(this.chartHotspotsRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [], // countries populated dynamically
        datasets: [{
          label: 'Goals by Country',
          data: [],
          backgroundColor: 'rgba(0,123,255,0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // --- Hourly chart ---
    this.charts.hourly = new Chart(this.chartHourlyRef.nativeElement, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => i.toString()), // 0–23 hours
        datasets: [{
          label: 'Events per Hour',
          data: Array(24).fill(0),
          backgroundColor: 'rgba(106,76,147,0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateRealTimeCharts(data: { goals: Goal[]; events: GoalEvent[] }): void {
    // --- Live Activity Feed (latest 8 events) ---
    const recent = [...data.events].sort((a, b) => b.ts.getTime() - a.ts.getTime()).slice(0, 8);
    document.getElementById('feedLive')!.innerHTML = recent
      .map(e => {
        const u = this.users.find((u: User) => u.id === e.userId);
        return `<li>${e.ts.toLocaleTimeString()} - ${u?.name || 'Unknown'} ${e.info}</li>`;
      })
      .join('');

    // --- Hotspots ---
    if (this.charts.hotspots) {
      this.charts.hotspots.data.labels = this.countries;
      this.charts.hotspots.data.datasets[0].data = this.countries.map(
        (cty: string) => data.goals.filter((g: Goal) => this.users.find((u: User) => u.id === g.userId)?.country === cty).length
      );
      this.charts.hotspots.update();
    }

    // --- Hourly pattern ---
    if (this.charts.hourly) {
      const buckets = Array(24).fill(0);
      data.events.forEach((e: GoalEvent) => buckets[e.ts.getHours()]++);
      this.charts.hourly.data.datasets[0].data = buckets;
      this.charts.hourly.update();
    }
  }
}

import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';

import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register required components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);


@Component({
  selector: 'app-daily-regitrations',
  templateUrl: './daily-regitrations.html',
  styleUrls: ['./daily-regitrations.scss']
})
export class DailyRegitrations implements OnInit, AfterViewInit {

  @ViewChild('forecastChart') fcChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('fcButton') fcButtonsRef!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('fcHorizonLbl') fcHorizonLblRef!: ElementRef<HTMLElement>;
  @ViewChild('fcActual') elActualRef!: ElementRef<HTMLElement>;
  @ViewChild('fcForecast') elForecastRef!: ElementRef<HTMLElement>;
  @ViewChild('fcAvg') elAvgRef!: ElementRef<HTMLElement>;
  @ViewChild('fcPeak') elPeakRef!: ElementRef<HTMLElement>;

  fcCtx!: HTMLCanvasElement;
  forecastChart: Chart | null = null;

  histSeries: number[] = [];
  histDays = 90;
  nf = new Intl.NumberFormat('en-IN');

  ngOnInit(): void {
    const rnd = this.lcg(42);
    this.histSeries = Array.from({ length: this.histDays }, (_, i) =>
      Math.max(10, Math.round(80 + i * 0.4 + (rnd() - 0.5) * 12))
    );
  }

  ngAfterViewInit(): void {
    this.fcCtx = this.fcChartRef.nativeElement;

    // ensure canvas fills parent height
    this.fcCtx.height = this.fcCtx.parentElement?.clientHeight || 300;

    // attach click events
    this.fcButtonsRef.toArray().forEach(b => {
      b.nativeElement.addEventListener('click', () => {
        const horizon = parseInt(b.nativeElement.dataset['fc']!, 10);
        this.updateForecast(horizon);
      });
    });

    this.updateForecast(30);
  }

  lcg(seed: number): () => number {
    let s = seed >>> 0;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return (s & 0xffff) / 0xffff;
    };
  }

  simpleForecast(lastSeries: number[], horizon: number): number[] {
    const lookback = Math.min(14, lastSeries.length);
    const recent = lastSeries.slice(-lookback);
    const mean = recent.reduce((a, b) => a + b, 0) / lookback;
    const slope = (recent[recent.length - 1] - recent[0]) / Math.max(1, lookback - 1);
    const out: number[] = [];
    const rnd = this.lcg(42);
    for (let d = 1; d <= horizon; d++) {
      const wiggle = 4 * Math.sin(d / 6.283);
      const noise = (rnd() - 0.5) * 4;
      out.push(Math.max(5, Math.round(mean + slope * d + wiggle + noise)));
    }
    return out;
  }

  labelFmt(v: number): string {
    return this.nf.format(v) + ' users';
  }

  splitMarker = {
    id: 'splitMarker',
    afterDatasetsDraw: (chart: any) => {
      const idx: number | undefined = chart.$splitIndex;
      if (idx == null) return;
      const { ctx, chartArea: { top, bottom } } = chart;
      const x = chart.scales.x.getPixelForValue(idx);
      ctx.save();
      ctx.strokeStyle = 'rgba(106,76,147,0.6)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      ctx.restore();
    }
  };

  updateForecast(horizon: number): void {
    if (!this.fcCtx) return;

    const nf = this.nf;
    const actualWindow = 30;
    const actual = this.histSeries.slice(-actualWindow);
    const forecast = this.simpleForecast(this.histSeries, horizon);

    const labels = [...Array(actual.length).keys()].map(i => `D-${actual.length - i}`)
      .concat([...Array(horizon).keys()].map(i => `+${i + 1}`));

    const ctx = this.fcCtx.getContext('2d')!;
    const g1 = ctx.createLinearGradient(0, 0, 0, 300);
    g1.addColorStop(0, 'rgba(0,123,255,0.25)');
    g1.addColorStop(1, 'rgba(0,123,255,0.02)');
    const g2 = ctx.createLinearGradient(0, 0, 0, 300);
    g2.addColorStop(0, 'rgba(106,76,147,0.25)');
    g2.addColorStop(1, 'rgba(106,76,147,0.02)');

    if (this.forecastChart) this.forecastChart.destroy();

    this.forecastChart = new Chart(this.fcCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Actual (Daily)',
            data: actual.concat(Array(horizon).fill(null)),
            tension: 0.35,
            pointRadius: 1.5,
            borderWidth: 2,
            borderColor: 'rgba(0,123,255,0.9)',
            backgroundColor: g1,
            fill: true
          },
          {
            label: 'Forecast',
            data: Array(actual.length).fill(null).concat(forecast),
            tension: 0.35,
            pointRadius: 1.5,
            borderWidth: 2,
            borderDash: [6, 6],
            borderColor: 'rgba(106,76,147,0.9)',
            backgroundColor: g2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, labels: { boxWidth: 12 } },
          tooltip: { callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${this.labelFmt(ctx.parsed.y)}` } }
        },
        scales: {
          x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (tickValue: string | number) => {
                const val = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
                return nf.format(val);
              }
            }
          }
        }
      },
      plugins: [this.splitMarker]
    });

    (this.forecastChart as any).$splitIndex = actual.length - 1;

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    this.elActualRef.nativeElement.textContent = nf.format(sum(actual));
    this.elForecastRef.nativeElement.textContent = nf.format(sum(forecast));
    this.elAvgRef.nativeElement.textContent = nf.format(Math.round(sum(forecast) / horizon));
    this.elPeakRef.nativeElement.textContent = nf.format(Math.max(...forecast));
    this.fcHorizonLblRef.nativeElement.textContent = horizon.toString();

    this.fcButtonsRef.toArray().forEach(b =>
      b.nativeElement.classList.toggle('active', b.nativeElement.dataset['fc'] === horizon.toString())
    );
  }
}

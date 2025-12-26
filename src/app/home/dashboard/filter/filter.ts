import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

type ServerFilterType =
  | 'Today'
  | 'Yesterday'
  | 'Last7days'
  | 'Last30days'
  | 'Lastyear'

  | 'Custom';

export interface ServerFilterPayload {
  filter_type: ServerFilterType;
  startDate?: string; // 'YYYY-MM-DD' (required if filter_type === 'Custom' or if your backend expects dates)
  endDate?: string;   // 'YYYY-MM-DD' (required if filter_type === 'Custom' or if your backend expects dates)
}

interface Stats {
  expense: number;
  income: number;
  transfer: number;
  total: number;
}

type QuickKey = 'today' | 'yesterday' | '7d' | '30d' | 'ytd' | 'custom';

const SERVER_TO_KEY: Record<ServerFilterType, QuickKey> = {
  Today: 'today',
  Yesterday: 'yesterday',
  Last7days: '7d',
  Last30days: '30d',
  Lastyear: 'ytd',   // interpret as Year-To-Date; adjust to rolling 365 if desired
  Custom: 'custom',
};

@Component({
  selector: 'app-filter',
  standalone: true,
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss'],
})

export class Filter implements AfterViewInit, OnChanges {
  @Input() config?: ServerFilterPayload;
  @Output() applied = new EventEmitter<{ start: Date; end: Date; label: string; key: QuickKey }>();

  @ViewChild('kpiRangeInput', { static: true }) kpiRangeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('kpiRangeLabel', { static: true }) kpiRangeLabel!: ElementRef<HTMLSpanElement>;

  // These are optional because <app-filter> is reused without KPI nodes present.
  @ViewChild('kpiExpense', { static: false }) kpiExpense?: ElementRef<HTMLElement>;
  @ViewChild('kpiIncome', { static: false }) kpiIncome?: ElementRef<HTMLElement>;
  @ViewChild('kpiTransfer', { static: false }) kpiTransfer?: ElementRef<HTMLElement>;
  @ViewChild('kpiTotal', { static: false }) kpiTotal?: ElementRef<HTMLElement>;

  activeKey: QuickKey = 'today';
  private fp!: any;

  private base30: Omit<Stats, 'total'> = {
    expense: 742,
    income: 528,
    transfer: 189,
  };

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;
    const { default: flatpickr } = await import('flatpickr');

    this.fp = flatpickr(this.kpiRangeInput.nativeElement, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'M j, Y',
      allowInput: true,
    });

    if (this.config) this.applyFromServer(this.config);
    else this.applyPreset('today');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.fp) {
      this.applyFromServer(this.config!);
    }
  }

  onOpenPicker(): void {
    this.fp?.open();
  }

  onClearPicker(): void {
    this.fp?.clear();
  }

  onApplyClick(): void {
    const sel: Date[] = this.fp?.selectedDates ?? [];
    if (!sel || sel.length < 2) return;

    let [start, end] = sel;
    if (start > end) [start, end] = [end, start];

    const days = this.daysInclusive(start, end);
    this.applyStats(this.computeByDays(days));

    const label = `Showing: ${this.fmtDate(start)} → ${this.fmtDate(end)} (${days} days)`;
    this.kpiRangeLabel.nativeElement.textContent = label;

    this.activeKey = 'custom';
    this.applied.emit({ start, end, label, key: 'custom' });
  }

  onResetClick(): void {
    this.fp?.clear();
    this.applyPreset('today');
  }

  onQuick(key: QuickKey): void {
    this.applyPreset(key);
  }

  private applyFromServer(payload: ServerFilterPayload): void {
    const key = SERVER_TO_KEY[payload.filter_type];

    if (key === 'custom') {
      if (!payload.startDate || !payload.endDate) {
        this.applyPreset('today');
        return;
      }
      const start = this.parseISO(payload.startDate);
      const end = this.parseISO(payload.endDate);
      if (!start || !end) {
        this.applyPreset('today');
        return;
      }
      this.setCustomRange(start, end, 'Showing: Custom range');
      return;
    }

    if (key === 'ytd') {
      this.applyPreset('ytd');
      return;
    }

    this.applyPreset(key);
  }

  private applyPreset(key: QuickKey): void {
    this.activeKey = key;

    const today = this.trunc(new Date());
    let start = today;
    let end = today;
    let labelText = 'Last 30 days';

    switch (key) {
      case 'today':
        start = end = today;
        labelText = 'Today';
        break;

      case 'yesterday':
        start = end = this.shiftDays(today, -1);
        labelText = 'Yesterday';
        break;

      case '7d':
        end = today;
        start = this.shiftDays(end, -6);
        labelText = 'Last 7 days';
        break;

      case '30d':
        end = today;
        start = this.shiftDays(end, -29);
        labelText = 'Last 30 days';
        break;

      case 'ytd': {
        const now = new Date();
        start = new Date(now.getFullYear(), 0, 1);
        end = today;
        labelText = 'Year to date';
        break;
      }

      case 'custom':
        return;
    }

    this.fp?.setDate([start, end], true);

    const days = this.daysInclusive(start, end);
    this.applyStats(this.computeByDays(days));
    this.kpiRangeLabel.nativeElement.textContent = `Showing: ${labelText}`;

    this.applied.emit({ start, end, label: `Showing: ${labelText}`, key });
  }

  private setCustomRange(start: Date, end: Date, labelPrefix = 'Showing:'): void {
    if (start > end) [start, end] = [end, start];

    this.activeKey = 'custom';
    this.fp?.setDate([start, end], true);

    const days = this.daysInclusive(start, end);
    this.applyStats(this.computeByDays(days));

    const label = `${labelPrefix} ${this.fmtDate(start)} → ${this.fmtDate(end)} (${days} days)`;
    this.kpiRangeLabel.nativeElement.textContent = label;

    this.applied.emit({ start, end, label, key: 'custom' });
  }

  private parseISO(s: string): Date | null {
    const [y, m, d] = s.split('-').map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? null : this.trunc(dt);
  }

  private trunc(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private shiftDays(base: Date, delta: number): Date {
    const d = new Date(base);
    d.setDate(d.getDate() + delta);
    return this.trunc(d);
  }

  private daysInclusive(a: Date, b: Date): number {
    const ms = Math.abs(this.trunc(b).getTime() - this.trunc(a).getTime());
    return Math.max(1, Math.round(ms / 86400000) + 1);
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  private fmt(n: number): string {
    return n.toLocaleString('en-IN');
  }

  private fmtDate(d: Date): string {
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private computeByDays(days: number): Stats {
    const scale = this.clamp(days / 30, 0.2, 3.0);
    const noise = (n: number): number => Math.round(n * (0.95 + Math.random() * 0.1));

    const expense = noise(Math.round(this.base30.expense * scale));
    const income = noise(Math.round(this.base30.income * scale));
    const transfer = noise(Math.round(this.base30.transfer * scale));
    const total = expense + income + transfer;

    return { expense, income, transfer, total };
  }

  private applyStats(stats: Stats): void {
    // In reusable mode, these nodes may not exist—skip safely.
    if (!this.kpiExpense || !this.kpiIncome || !this.kpiTransfer || !this.kpiTotal) return;

    this.kpiExpense.nativeElement.textContent = this.fmt(stats.expense);
    this.kpiIncome.nativeElement.textContent = this.fmt(stats.income);
    this.kpiTransfer.nativeElement.textContent = this.fmt(stats.transfer);
    this.kpiTotal.nativeElement.textContent = this.fmt(stats.total);
  }
}

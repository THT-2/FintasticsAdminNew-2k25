import { AfterViewInit, Component } from '@angular/core';
// import flatpickr from 'flatpickr';


interface Stats {
  expense: number;
  income: number;
  transfer: number;
  total: number;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
  styleUrls: ['./filter.scss']
})
export class Filter implements AfterViewInit {

  private elExp!: HTMLElement;
  private elInc!: HTMLElement;
  private elTra!: HTMLElement;
  private elTot!: HTMLElement;
  private lbl!: HTMLElement;

  private fp!: any;

  private base30: Omit<Stats, 'total'> = {
    expense: 742,
    income: 528,
    transfer: 189
  };


  async ngAfterViewInit(): Promise<void> {

  if (typeof window === 'undefined') return;

  const { default: flatpickr } = await import('flatpickr');

  this.elExp = document.getElementById('kpi-expense')!;
  this.elInc = document.getElementById('kpi-income')!;
  this.elTra = document.getElementById('kpi-transfer')!;
  this.elTot = document.getElementById('kpi-total')!;
  this.lbl = document.getElementById('kpiRangeLabel')!;

  const rangeButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.kpi-range'));

  this.fp = flatpickr('#kpiRange', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'M j, Y',
    allowInput: true
  });




    document.getElementById('openPicker')?.addEventListener('click', () => this.fp.open());
    document.getElementById('kpiClear')?.addEventListener('click', () => this.fp.clear());

    rangeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const range = btn.dataset['range'];
        if (range) this.applyPreset(range, rangeButtons);
      });
    });

    document.getElementById('kpiApply')?.addEventListener('click', () => {
      const sel = this.fp.selectedDates;
      if (!sel || sel.length < 2) return;

      const ms = Math.abs(sel[1].getTime() - sel[0].getTime());
      const days = Math.max(1, Math.round(ms / 86400000) + 1);
      const stats = this.computeByDays(days);
      this.applyStats(stats);

      const fmtDate = (d: Date): string =>
        d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

      this.lbl.textContent = `Showing: ${fmtDate(sel[0])} → ${fmtDate(sel[1])} (${days} days)`;
      this.setActiveRange('', rangeButtons);
    });

    document.getElementById('kpiReset')?.addEventListener('click', () => {
      this.fp.clear();
      this.applyPreset('30d', rangeButtons);
    });

    this.applyPreset('30d', rangeButtons);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private fmt(n: number): string {
    return n.toLocaleString('en-IN');
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
    this.elExp.textContent = this.fmt(stats.expense);
    this.elInc.textContent = this.fmt(stats.income);
    this.elTra.textContent = this.fmt(stats.transfer);
    this.elTot.textContent = this.fmt(stats.total);
  }

  private setActiveRange(key: string, buttons: HTMLButtonElement[]): void {
    buttons.forEach(btn =>
      btn.classList.toggle('active', btn.dataset['range'] === key)
    );
  }

  private applyPreset(key: string, buttons: HTMLButtonElement[]): void {
    this.setActiveRange(key, buttons);
    let days = 30;
    let text = 'Last 30 days';

    switch (key) {
      case 'today':
        days = 1;
        text = 'Today';
        break;
      case 'yesterday':
        days = 1;
        text = 'Yesterday';
        break;
      case '7d':
        days = 7;
        text = 'Last 7 days';
        break;
      case '30d':
        days = 30;
        text = 'Last 30 days';
        break;
      case 'ytd':
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        days = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000));
        text = 'Year to date';
        break;
    }

    const stats = this.computeByDays(days);
    this.applyStats(stats);
    this.lbl.textContent = `Showing: ${text}`;
  }
}

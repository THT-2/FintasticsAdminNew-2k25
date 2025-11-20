import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  name: string;
  amount: number;
  type: 'Income' | 'Expense' | 'Transfer';
  through: 'SMS' | 'AI Voice' | 'Scan' | 'Whatsapp' | 'Manual' | string;
}

@Component({
  selector: 'app-top-users',
  imports:[CommonModule,FormsModule],
  templateUrl: './top-users.html',
  styleUrls: ['./top-users.scss']
})
export class TopUsers implements AfterViewInit {

  seed: Transaction[] = [
    { name: 'Anita Das', amount: 1240, type: 'Expense', through: 'SMS' },
    { name: 'Kunal Verma', amount: 3500, type: 'Income', through: 'Manual' },
    { name: 'Meera Joshi', amount: 780, type: 'Expense', through: 'Scan' },
    { name: 'Sanjay Rao', amount: 2100, type: 'Transfer', through: 'Whatsapp' },
    { name: 'Riya Kapoor', amount: 540, type: 'Expense', through: 'SMS' },
    { name: 'Arjun Patel', amount: 9200, type: 'Income', through: 'AI Voice' },
    { name: 'Neha Jain', amount: 1300, type: 'Transfer', through: 'Manual' },
    { name: 'Vivek Singh', amount: 450, type: 'Expense', through: 'Scan' },
    { name: 'Saira Khan', amount: 2200, type: 'Income', through: 'Manual' },
    { name: 'Yash Gupta', amount: 980, type: 'Expense', through: 'SMS' }
  ];

  displayedItems: Transaction[] = this.seed.slice(0, 7);

  dist = 0;    
  duration = 18;

  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.calculateStyles();

    this.intervalId = setInterval(() => this.randomPush(), 4000);

    // Expose API globally if needed
    (window as any).updateLiveTransactions = (arr: Transaction[]) => {
      if (Array.isArray(arr)) {
        this.displayedItems = arr.slice(0, 10);
        this.calculateStyles();
      }
    };
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  badgeClass(type: Transaction['type']): string {
    switch(type) {
      case 'Income': return 'income';
      case 'Expense': return 'expense';
      default: return 'transfer';
    }
  }

  methodIcon(method: Transaction['through']): string {
    const icons: Record<string, string> = {
      'SMS': 'bi bi-chat-left-text',
      'AI Voice': 'bi bi-mic',
      'Scan': 'bi bi-qr-code-scan',
      'Whatsapp': 'bi bi-whatsapp',
      'Manual': 'bi bi-hand-index-thumb'
    };
    return icons[method] || 'bi bi-lightning';
  }

  private calculateStyles() {
    // Calculate scrollHeight via DOM only in browser
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const listEl = document.getElementById('live-tx-list');
      if (!listEl) return;

      // Distance is half the scroll height because we duplicate the list
      this.dist = listEl.scrollHeight / 2;
      this.duration = Math.max(18, Math.round(this.dist / 12));
    }, 0);
  }

  private randomPush() {
    const b = this.seed[Math.floor(Math.random() * this.seed.length)];
    const jitter = Math.max(100, Math.round(b.amount * (0.7 + Math.random() * 0.6)));
    const entry = { ...b, amount: jitter };
    this.displayedItems = [entry, ...this.displayedItems].slice(0, 10);
    this.calculateStyles();
  }
}

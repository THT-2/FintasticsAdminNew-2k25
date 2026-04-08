import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, Pipe, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js';


type ExpenseFilter = 'today' | 'yesterday' | 'monthly' | 'yearly' | 'custom';
type ExpenseModule = 'transaction' | 'budget' | 'accounts' | 'dues' | 'goals' | 'hometronics';

type TransactionData = { sms: number; whatsapp: number; manual: number; ai: number; excel: number };
type BudgetItem = { 
  name: string; 
  spent: number; 
  budget: number; 
  color?: string; 
};
type AccountsData = {
  passbook: { count: number; usage: number };
  insurance: { count: number; usage: number };
  wallet: { count: number; usage: number };
  bank: { count: number; usage: number };
  credit: { count: number; usage: number };
};
type DuesData = { toPay: number; income: number };
type GoalsData = { completed: number; inProgress: number };
type HometronicsData = { electronics: number; appliances: number; furniture: number; kitchen: number };

type ExpenseDataByFilter = {
  transaction: TransactionData;
  budget: BudgetItem[];
  accounts: AccountsData;
  dues: DuesData;
  goals: GoalsData;
  hometronics: HometronicsData;
};
import {
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  LineController,
  BarController,
  DoughnutController
} from 'chart.js';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { pipe } from 'rxjs';

Chart.register(
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  LineController,
  BarController,
  DoughnutController
);

@Component({
  selector: 'app-user-main-area',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    RouterModule
],
  templateUrl: './user-main-area.html',
  styleUrl: './user-main-area.scss'
})
export class UserMainArea implements AfterViewInit, OnDestroy {
  sidebarOpened = true;
viewReady = false;
dataLoaded = false;
private pendingInitialRender = false;
  @ViewChild('expenseTrendCanvas', { static: false })
expenseTrendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('expenseCategoriesCanvas') expenseCategoriesCanvas!: ElementRef<HTMLCanvasElement>;
@ViewChild('moduleUsageCanvas')
moduleUsageCanvas!: ElementRef<HTMLCanvasElement>;
@Input() trackingData: any[] = [];
@Input() transectionscount: any[] = []; 
@Input() categoryBreakdown: any[] = [];
@Input() passbookData: any[] = [];
@Input() goaldashboard_data: any;
@Input() reminders: any[] = [];
@Input() dashboard_data: any;
@Input() rewardpoints: any;
@Input() deviceDetails: any;
@Input() categorySummary: any[] = [];

constructor(private cd: ChangeDetectorRef,private zone: NgZone){}
ngOnInit() {
    setTimeout(() => {
    this.viewReady = true;
    this.tryRenderCategoryChart();
    // this.renderAllCharts();   // ✅ THIS IS THE FIX
  });
}


private moduleUsageChart?: Chart<'bar'>;
  private expenseTrendChart?: Chart;
  private expenseCategoriesChart?: Chart;

  // ==============================
  // ✅ Converted "expense" script state
  // ==============================
  expenseCurrentFilter: ExpenseFilter = 'today';
  expenseCurrentModule: ExpenseModule = 'transaction';

  private expenseTransactionChart?: Chart;
  private expenseAccountsChart?: Chart;
  private expenseBudgetChart?: Chart;
  private expenseDuesChart?: Chart;
  private expenseGoalsChart?: Chart;
  private expenseHometronicsChart?: Chart;
 
  // Data with module usage times
  private readonly expenseData: Record<'today' | 'yesterday' | 'monthly' | 'yearly', ExpenseDataByFilter> = {
    today: {
      transaction: { sms: 35, whatsapp: 28, manual: 45, ai: 15, excel: 24 },
      budget: [
        { name: 'Food', spent: 2500, budget: 3000 },
        { name: 'Transport', spent: 1200, budget: 2000 },
        { name: 'Entertainment', spent: 800, budget: 1500 },
        { name: 'Shopping', spent: 4500, budget: 5000 }
      ],
      accounts: {
        passbook: { count: 3, usage: 65 },
        insurance: { count: 2, usage: 45 },
        wallet: { count: 1, usage: 85 },
        bank: { count: 4, usage: 92 },
        credit: { count: 2, usage: 78 }
      },
      dues: { toPay: 11900, income: 6450 },
      goals: { completed: 2, inProgress: 3 },
      hometronics: { electronics: 7, appliances: 3, furniture: 1, kitchen: 1 }
    }, 
    yesterday: {
      transaction: { sms: 28, whatsapp: 22, manual: 38, ai: 12, excel: 19 },
      budget: [
        { name: 'Food', spent: 1800, budget: 3000 },
        { name: 'Transport', spent: 950, budget: 2000 },
        { name: 'Entertainment', spent: 600, budget: 1500 },
        { name: 'Shopping', spent: 3200, budget: 5000 }
      ],
      accounts: {
        passbook: { count: 3, usage: 62 },
        insurance: { count: 2, usage: 42 },
        wallet: { count: 1, usage: 78 },
        bank: { count: 4, usage: 88 },
        credit: { count: 2, usage: 75 }
      },
      dues: { toPay: 11200, income: 5200 },
      goals: { completed: 2, inProgress: 3 },
      hometronics: { electronics: 6, appliances: 3, furniture: 1, kitchen: 1 }
    },
    monthly: {
      transaction: { sms: 420, whatsapp: 335, manual: 540, ai: 180, excel: 288 },
      budget: [
        { name: 'Food', spent: 12500, budget: 15000 },
        { name: 'Transport', spent: 6000, budget: 8000 },
        { name: 'Entertainment', spent: 4000, budget: 6000 },
        { name: 'Shopping', spent: 16000, budget: 20000 }
      ],
      accounts: {
        passbook: { count: 3, usage: 68 },
        insurance: { count: 2, usage: 52 },
        wallet: { count: 1, usage: 88 },
        bank: { count: 4, usage: 94 },
        credit: { count: 2, usage: 82 }
      },
      dues: { toPay: 27500, income: 12900 },
      goals: { completed: 3, inProgress: 2 },
      hometronics: { electronics: 9, appliances: 5, furniture: 2, kitchen: 2 }
    },
    yearly: {
      transaction: { sms: 5040, whatsapp: 4020, manual: 6480, ai: 2160, excel: 3456 },
      budget: [
        { name: 'Food', spent: 150000, budget: 180000 },
        { name: 'Transport', spent: 72000, budget: 96000 },
        { name: 'Entertainment', spent: 48000, budget: 72000 },
        { name: 'Shopping', spent: 192000, budget: 240000 }
      ],
      accounts: {
        passbook: { count: 3, usage: 72 },
        insurance: { count: 2, usage: 58 },
        wallet: { count: 1, usage: 92 },
        bank: { count: 4, usage: 98 },
        credit: { count: 2, usage: 88 }
      },
      dues: { toPay: 112000, income: 78000 },
      goals: { completed: 4, inProgress: 1 },
      hometronics: { electronics: 12, appliances: 7, furniture: 3, kitchen: 3 }
    }
  };

  private readonly expenseModuleUsageTimes: Record<
    'today' | 'yesterday' | 'monthly' | 'yearly',
    Record<ExpenseModule, string>
  > = {
    today: {
      transaction: '3h 45m',
      budget: '4h 30m',
      accounts: '2h 15m',
      dues: '1h 20m',
      goals: '1h 50m',
      hometronics: '45m'
    },
    yesterday: {
      transaction: '2h 30m',
      budget: '3h 15m',
      accounts: '1h 45m',
      dues: '55m',
      goals: '1h 20m',
      hometronics: '35m'
    },
    monthly: {
      transaction: '25h 10m',
      budget: '32h 15m',
      accounts: '18h 30m',
      dues: '12h 45m',
      goals: '14h 20m',
      hometronics: '8h 15m'
    },
    yearly: {
      transaction: '168h 40m',
      budget: '245h 30m',
      accounts: '156h 20m',
      dues: '98h 45m',
      goals: '120h 15m',
      hometronics: '65h 30m'
    }
  };

  // Color schemes for each module
  private readonly expenseModuleColors: Record<ExpenseModule, string[]> = {
    transaction: ['#8B5CF6', '#10B981', '#0EA5E9', '#F59E0B', '#EC4899'],
    accounts: ['#8B5CF6', '#10B981', '#0EA5E9', '#F59E0B', '#EC4899'],
    dues: ['#EF4444', '#10B981'],
    goals: ['#10B981', '#0EA5E9'],
    hometronics: ['#8B5CF6', '#0EA5E9', '#F59E0B', '#10B981'],
    budget: ['#8B5CF6'] // typing safety
  };

  get transactionSummary() {
  return this.getTransactionDataFromAPI();
}

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  goBack() {
    history.back();
  }

ngOnChanges(changes: any) {
  console.log('ngOnChanges fired', changes);

  if (!this.viewReady) {
    this.pendingInitialRender = true;
    return;
  }

  this.renderDashboardParts(changes);
}

ngAfterViewInit(): void {
  this.viewReady = true;

  if (this.pendingInitialRender) {
    this.pendingInitialRender = false;
    this.renderDashboardParts();
  } else {
    this.renderDashboardParts();
  }
}

  ngOnDestroy(): void {
    // ✅ destroy existing charts
    this.expenseTrendChart?.destroy();
    this.expenseCategoriesChart?.destroy();

    // ✅ destroy module charts
    this.expenseTransactionChart?.destroy();
    this.expenseAccountsChart?.destroy();
    this.expenseBudgetChart?.destroy();
    this.expenseDuesChart?.destroy();
    this.expenseGoalsChart?.destroy();
    this.expenseHometronicsChart?.destroy();
  }

  private renderDashboardParts(changes?: any) {
  if (this.trackingData?.length) {
    this.tryRenderModuleChart();
  } else {
    this.moduleUsageChart?.destroy();
  }

  if (this.categorySummary?.length) {
    this.tryRenderCategoryChart();
  } else {
    this.expenseCategoriesChart?.destroy();
  }

  // initial/default tab
  this.expenseLoadModule(this.expenseCurrentModule);

  // if specific inputs changed, re-render their module too
  
  if (changes?.['transectionscount']) {
    this.expenseLoadModule('transaction');
  }
  if (changes?.['categoryBreakdown']) {
    this.expenseLoadModule('budget');
  }
  if (changes?.['passbookData']) {
    this.expenseLoadModule('accounts');
  }
  if (changes?.['dashboard_data']) {
    this.expenseLoadModule('dues');
  }
  if (changes?.['goaldashboard_data']) {
    this.expenseLoadModule('goals');
  }
}
private tryRenderModuleChart() {
  if (!this.trackingData?.length) return;
  if (!this.moduleUsageCanvas?.nativeElement) return;

  const canvas = this.moduleUsageCanvas.nativeElement;
  if (canvas.offsetHeight === 0 || canvas.offsetWidth === 0) {
    return;
  }

  this.initModuleUsageChart();
}



  // ======================================
  // ✅ EXISTING CHARTS (unchanged, just stored)
  // ======================================
  private initCharts(): void {
    console.log("initchart");
    

    if (!this.expenseTrendCanvas) return;   // ✅ FIX

  const canvas = this.expenseTrendCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
    this.expenseTrendChart?.destroy();
    // this.expenseCategoriesChart?.destroy();

    this.expenseTrendChart = new Chart(this.expenseTrendCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Expenses',
            data: [15000, 16200, 15800, 17200, 16500, 18200, 17500, 19200, 18800, 19500, 20200, 21000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.12)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Income',
            data: [18000, 19500, 19200, 21000, 20500, 22500, 21800, 24000, 23500, 24500, 25500, 26500],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.12)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => '₹' + Number(v).toLocaleString('en-IN')
            }
          }
        }
      }
    });

    // this.expenseCategoriesChart = new Chart(this.expenseCategoriesCanvas.nativeElement, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Healthcare', 'Others'],
    //     datasets: [
    //       {
    //         data: [25, 20, 15, 12, 10, 8, 10],
    //         backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#0ea5e9', '#94a3b8'],
    //         borderWidth: 2,
    //         borderColor: '#ffffff'
    //       }
    //     ]
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     plugins: { legend: { display: false } },
    //     cutout: '65%'
    //   }
    // });
  }

  // ======================================
  // ✅ CONVERTED SCRIPT: Public functions
  // ======================================

private tryRenderCategoryChart() {
  if (!this.categorySummary?.length) return;
  if (!this.expenseCategoriesCanvas?.nativeElement) return;

  const canvas = this.expenseCategoriesCanvas.nativeElement;
  if (canvas.offsetHeight === 0 || canvas.offsetWidth === 0) {
    return;
  }

  this.initExpenseCategoriesFromAPI();
}

  expenseChangeFilter(filter: ExpenseFilter, ev?: Event) {
    this.expenseCurrentFilter = filter;

    document.querySelectorAll('.expense-filter-btn').forEach((btn) => btn.classList.remove('active'));
    const target = (ev?.currentTarget ?? (window as any).event?.currentTarget) as HTMLElement | undefined;
    target?.classList.add('active');

    const current = document.getElementById('expenseCurrentFilter');
    if (current) current.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);

    document.getElementById('expenseDatePicker')?.classList.add('expense-hidden');

    this.expenseLoadModule(this.expenseCurrentModule);
  }

  expenseToggleCustomDate(ev?: Event) {
    const picker = document.getElementById('expenseDatePicker');
    if (!picker) return;

    const isHidden = picker.classList.contains('expense-hidden');

    document.querySelectorAll('.expense-filter-btn').forEach((btn) => btn.classList.remove('active'));

    const target = (ev?.currentTarget ?? (window as any).event?.currentTarget) as HTMLElement | undefined;

    if (isHidden) {
      picker.classList.remove('expense-hidden');
      target?.classList.add('active');
      this.expenseCurrentFilter = 'custom';
    } else {
      picker.classList.add('expense-hidden');
    }
  }

  expenseApplyCustomDate() {
    const startDate = (document.getElementById('expenseStartDate') as HTMLInputElement | null)?.value;
    const endDate = (document.getElementById('expenseEndDate') as HTMLInputElement | null)?.value;

    if (!startDate || !endDate) {
      alert('Please select both dates');
      return;
    }

    this.expenseCurrentFilter = 'custom';
    const current = document.getElementById('expenseCurrentFilter');
    if (current) current.textContent = `${this.expenseFormatDate(startDate)} - ${this.expenseFormatDate(endDate)}`;

    this.expenseLoadModule(this.expenseCurrentModule);
  }

expenseChangeModule(module: ExpenseModule, ev?: Event) {
  this.expenseCurrentModule = module;

  document.querySelectorAll('.expense-tab').forEach(tab => tab.classList.remove('active'));
  const target = (ev?.currentTarget ?? (window as any).event?.currentTarget) as HTMLElement | undefined;
  target?.classList.add('active');

  document.querySelectorAll('.expense-module-content').forEach(view => view.classList.add('expense-hidden'));

  const el = document.getElementById(`expense-${module}-view`);
  el?.classList.remove('expense-hidden');

  // 🔥 IMPORTANT FIX
  setTimeout(() => {
    this.expenseLoadModule(module);

    // 🔥 force chart resize (VERY IMPORTANT)
    this.expenseTransactionChart?.resize();
    this.expenseBudgetChart?.resize();
    this.expenseAccountsChart?.resize();
    this.expenseDuesChart?.resize();
    this.expenseGoalsChart?.resize();
    this.expenseHometronicsChart?.resize();

  }, 200);
}
  expenseRefreshData(ev?: Event) {
    this.expenseLoadModule(this.expenseCurrentModule);

    const btn = (ev?.currentTarget ?? (window as any).event?.currentTarget) as HTMLButtonElement | null;
    if (!btn) return;

    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Done';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 1000);
  }

  // ======================================
  // ✅ CONVERTED SCRIPT: Loader
  // ======================================
private expenseLoadModule(module: ExpenseModule) {

  const filterKey = this.expenseCurrentFilter;
  const baseFilter =
    filterKey === 'custom' ? 'monthly' : filterKey;

  let moduleData;

  if (module === 'transaction') {
    moduleData = this.convertToPercentage(this.getTransactionDataFromAPI());

  } else if (module === 'budget') {
    moduleData = this.getBudgetFromAPI();

  } else if (module === 'accounts') {
    moduleData = this.getAccountsFromAPI();

  } else if (module === 'goals') {
    moduleData = this.getGoalsFromAPI();

  } else if (module === 'dues') {
    moduleData = this.getDuesFromAPI();

  } else {
    moduleData = this.expenseData[baseFilter][module];
  }

  switch (module) {
    case 'transaction':
      this.expenseLoadTransaction(moduleData as TransactionData);
      break;
    case 'budget':
      this.expenseLoadBudget(moduleData as BudgetItem[]);
      break;
    case 'accounts':
      this.expenseLoadAccounts(moduleData as AccountsData);
      break;
    case 'dues':
      this.expenseLoadDues(moduleData as DuesData);
      break;
    case 'goals':
      this.expenseLoadGoals(moduleData as GoalsData);
      break;
    case 'hometronics':
      this.expenseLoadHometronics(moduleData as HometronicsData);
      break;
  }

  this.expenseUpdateModuleUsageTime(module);
}
  private expenseUpdateModuleUsageTime(module: ExpenseModule) {
    const filterKey = this.expenseCurrentFilter;
    const baseFilter: 'today' | 'yesterday' | 'monthly' | 'yearly' = filterKey === 'custom' ? 'monthly' : filterKey;

    const usageTime = this.expenseModuleUsageTimes[baseFilter][module];
    const el = document.getElementById(`expense${module.charAt(0).toUpperCase() + module.slice(1)}ModuleUsage`);
    if (el) el.textContent = usageTime;
  }

  // ======================================
  // ✅ CONVERTED SCRIPT: Modules
  // ======================================
private expenseLoadTransaction(transactionData: TransactionData) {

  const labels = ['SMS', 'WhatsApp', 'Manual', 'AI', 'Excel'];

  const values = [
    transactionData.sms,
    transactionData.whatsapp,
    transactionData.manual,
    transactionData.ai,
    transactionData.excel
  ];

  const colors = this.expenseModuleColors.transaction;

  const totalTransactions = values.reduce((a, b) => a + b, 0);

  const overallPercentage =
    totalTransactions === 0
      ? 0
      : this.expenseCalculateTransactionPercentage(values);

  // ✅ center text
  const center = document.getElementById('expenseTransactionPercentage');
  if (center) {
    center.innerHTML = `
      <div class="expense-percentage-value">
        ${totalTransactions === 0 ? 'No Data' : overallPercentage + '%'}
      </div>
      <div class="expense-percentage-label">
        ${totalTransactions === 0 ? 'No Transactions' : 'Overall Usage'}
      </div>
    `;
  }
const canvas = document.getElementById('expenseTransactionChart') as HTMLCanvasElement | null;

if (!canvas) return;

// ❗ if hidden → DO NOT render
if (canvas.offsetHeight === 0 || canvas.offsetWidth === 0) {

  // 🔥 IMPORTANT: destroy broken chart
  this.expenseTransactionChart?.destroy();
  this.expenseTransactionChart = undefined;

  setTimeout(() => this.expenseLoadTransaction(transactionData), 150);
  return;
}
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

if (!canvas || canvas.offsetHeight === 0) {
  setTimeout(() => this.expenseLoadTransaction(transactionData), 100);
  return;
}

  // 🔥 ✅ FIX STARTS HERE

  if (this.expenseTransactionChart) {
    // ✅ UPDATE EXISTING CHART
    this.expenseTransactionChart.data.labels = labels;
    this.expenseTransactionChart.data.datasets[0].data = values;
    this.expenseTransactionChart.update();   // 🔥 IMPORTANT
  } else {
    // ✅ CREATE ONLY ONCE
    this.expenseTransactionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percent = total === 0 ? 0 : ((context.raw / total) * 100).toFixed(1);
                return `${context.label}: ${context.raw} (${percent}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  // 🔥 FIX ENDS HERE

  // ✅ legend (keep same)
  const legend = document.getElementById('expenseTransactionLegend');

  if (legend) {
    legend.innerHTML = '';

    labels.forEach((label, i) => {

      const percent =
        totalTransactions === 0
          ? 0
          : ((values[i] / totalTransactions) * 100).toFixed(1);

      const item = document.createElement('div');
      item.className = 'expense-legend-item';
      item.style.borderLeftColor = colors[i];

      item.innerHTML = `
        <div class="expense-legend-color" style="background: ${colors[i]};"></div>
        <div class="expense-legend-text">${label}</div>
        <div class="expense-legend-value">
          ${totalTransactions === 0 ? '-' : percent + '%'}
        </div>
      `;

      legend.appendChild(item);
    });

    const totalEl = document.getElementById('expenseTransactionTotal');
    const mostEl = document.getElementById('expenseMostUsed');

    if (totalEl) totalEl.textContent = String(totalTransactions);

    if (mostEl) {
      if (totalTransactions === 0) {
        mostEl.textContent = 'No Data';
      } else {
        const maxIndex = values.indexOf(Math.max(...values));
        const mostUsedPercentage = ((values[maxIndex] / totalTransactions) * 100).toFixed(0);
        mostEl.textContent = `${labels[maxIndex]} (${mostUsedPercentage}%)`;
      }
    }
  }
}

private expenseLoadBudget(budgetData: BudgetItem[]) {

  // ✅ SAFE FALLBACK
  if (!budgetData || budgetData.length === 0) {

    document.getElementById('expenseSpentPercentage')!.textContent = 'No Data';
    document.getElementById('expenseBudgetPercentage')!.textContent = 'No Data';
    document.getElementById('expenseRemainingPercentage')!.textContent = 'No Data';

    // destroy chart if exists
    this.expenseBudgetChart?.destroy();

    return;
  }

  const labels = budgetData.map(item => item.name);
  const spentValues = budgetData.map(item => item.spent || 0);
  const budgetValues = budgetData.map(item => item.budget || 0);

  const totalSpent = spentValues.reduce((a, b) => a + b, 0);
  const totalBudget = budgetValues.reduce((a, b) => a + b, 0);
  const remaining = totalBudget - totalSpent;

  // ✅ HANDLE ZERO BUDGET CASE
  const spentPercentage = totalBudget === 0 ? 0 : Math.round((totalSpent / totalBudget) * 100);
  const remainingPercentage = totalBudget === 0 ? 0 : Math.round((remaining / totalBudget) * 100);

  document.getElementById('expenseSpentPercentage')!.textContent =
    totalBudget === 0 ? 'No Budget' : `${spentPercentage}%`;

  document.getElementById('expenseBudgetPercentage')!.textContent =
    totalBudget === 0 ? 'No Budget' : `100%`;

  document.getElementById('expenseRemainingPercentage')!.textContent =
    totalBudget === 0 ? 'No Budget' : `${remainingPercentage}%`;

  const canvas = document.getElementById('expenseBudgetChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  const colors = budgetData.map(item => item.color || '#8B5CF6');

  this.expenseBudgetChart?.destroy();

  this.expenseBudgetChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Spent',
          data: spentValues,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.6
        },
        {
          label: 'Budget',
          data: budgetValues,
          backgroundColor: colors.map(c => this.hexToTransparent(c)),
          borderRadius: 4,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {

              if (totalBudget === 0) return 'No Budget';

              let label = context.dataset.label || '';
              if (label) label += ': ₹';

              label += Number(context.raw).toLocaleString('en-IN');

              if (context.datasetIndex === 0) {
                const budget = budgetValues[context.dataIndex];
                const percent = budget === 0 ? 0 : ((context.raw / budget) * 100).toFixed(1);
                label += ` (${percent}% of budget)`;
              }

              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          border: { display: false },
          ticks: {
            callback: (value: any) => '₹' + Number(value).toLocaleString('en-IN')
          }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}
private hexToTransparent(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, 0.3)`;
}

private expenseLoadAccounts(accountsData: AccountsData) {

  const labels = ['Passbook', 'Insurance', 'Wallet', 'Bank', 'Credit Cards'];

  const usageValues = [
    accountsData.passbook.usage,
    accountsData.insurance.usage,
    accountsData.wallet.usage,
    accountsData.bank.usage,
    accountsData.credit.usage
  ];

  const countValues = [
    accountsData.passbook.count,
    accountsData.insurance.count,
    accountsData.wallet.count,
    accountsData.bank.count,
    accountsData.credit.count
  ];

  const colors = [
    '#8B5CF6',
    '#10B981',
    '#0EA5E9',
    '#F59E0B',
    '#EC4899'
  ];

  // ✅ FIX typo + total
  const totalUsage = usageValues.reduce((a, b) => a + b, 0);

  // ✅ safe percentage
  const overallPercentage =
    totalUsage === 0
      ? 0
      : this.safePercentage(totalUsage, usageValues.length * 100);

  // ✅ center text
  const center = document.getElementById('expenseAccountsPercentage');
  if (center) {
    center.innerHTML = `
      <div class="expense-percentage-value">
        ${totalUsage === 0 ? 'No Data' : overallPercentage + '%'}
      </div>
      <div class="expense-percentage-label">
        ${totalUsage === 0 ? 'No Accounts' : 'Overall Usage'}
      </div>
    `;
  }

  // ✅ chart
  const canvas = document.getElementById('expenseAccountsChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  this.expenseAccountsChart?.destroy();

  this.expenseAccountsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: usageValues,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percent = total === 0 ? 0 : ((context.raw / total) * 100).toFixed(1);

              return `${context.label}: ${context.raw}% (${percent}%) (${countValues[context.dataIndex]} accounts)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // ✅ legend
  const legend = document.getElementById('expenseAccountsLegend');

  if (legend) {
    legend.innerHTML = '';

    labels.forEach((label, i) => {

      const percent =
        totalUsage === 0
          ? 0
          : ((usageValues[i] / totalUsage) * 100).toFixed(1);

      const item = document.createElement('div');
      item.className = 'expense-legend-item';
      item.style.borderLeftColor = colors[i];

      item.innerHTML = `
        <div class="expense-legend-color" style="background: ${colors[i]};"></div>
        <div class="expense-legend-text">${label}</div>
        <div class="expense-legend-value">
          ${totalUsage === 0 ? '-' : percent + '%'}
        </div>
      `;

      legend.appendChild(item);
    });

    // ✅ summary
    const totalAccounts = countValues.reduce((a, b) => a + b, 0);

    const totalEl = document.getElementById('expenseTotalAccounts');
    const mostEl = document.getElementById('expenseMostUsedAccount');

    if (totalEl) totalEl.textContent = String(totalAccounts);

    if (mostEl) {
      if (totalUsage === 0) {
        mostEl.textContent = 'No Data';
      } else {
        const maxIndex = usageValues.indexOf(Math.max(...usageValues));
        mostEl.textContent = `${labels[maxIndex]} (${usageValues[maxIndex]}%)`;
      }
    }
  }
}

private expenseLoadDues(duesData: DuesData) {

  const labels = ['To Pay', 'Income'];

  const values = [
    duesData.toPay,
    duesData.income
  ];

  const colors = this.expenseModuleColors.dues;

  // ✅ total
  const total = values[0] + values[1];

  // ✅ safe percentage
  const toPayPercentage = this.safePercentage(values[0], total);

  // ✅ center text
  const center = document.getElementById('expenseDuesPercentage');
  if (center) {
    center.innerHTML = `
      <div class="expense-percentage-value">
        ${total === 0 ? 'No Data' : toPayPercentage + '%'}
      </div>
      <div class="expense-percentage-label">
        ${total === 0 ? 'No Dues' : 'To Pay'}
      </div>
    `;
  }

  // ✅ chart
  const canvas = document.getElementById('expenseDuesChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  this.expenseDuesChart?.destroy();

  this.expenseDuesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percent = total === 0 ? 0 : ((context.raw / total) * 100).toFixed(1);

              return `${context.label}: ₹${Number(context.raw).toLocaleString('en-IN')} (${percent}%)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // ✅ legend
  const legend = document.getElementById('expenseDuesLegend');

  if (legend) {
    legend.innerHTML = '';

    labels.forEach((label, i) => {

      const percent =
        total === 0
          ? 0
          : ((values[i] / total) * 100).toFixed(1);

      const item = document.createElement('div');
      item.className = 'expense-legend-item';
      item.style.borderLeftColor = colors[i];

      item.innerHTML = `
        <div class="expense-legend-color" style="background: ${colors[i]};"></div>
        <div class="expense-legend-text">${label}</div>
        <div class="expense-legend-value">
          ${total === 0 ? '-' : percent + '%'}
        </div>
      `;

      legend.appendChild(item);
    });

    // ✅ summary
    const totalEl = document.getElementById('expenseTotalDues');
    const toPayEl = document.getElementById('expenseToPayAmount');
    

    if (totalEl) {
      totalEl.textContent =
        total === 0
          ? 'No Data'
          : `₹${Number(total).toLocaleString('en-IN')}`;
    }

    if (toPayEl) {
      toPayEl.textContent =
        total === 0
          ? '-'
          : `₹${Number(values[0]).toLocaleString('en-IN')}`;
    }
  }
}

private expenseLoadGoals(goalsData: GoalsData) {

  const labels = ['Completed', 'In Progress'];

  const values = [
    goalsData.completed,
    goalsData.inProgress
  ];

  const colors = this.expenseModuleColors.goals;

  // ✅ total
  const total = values[0] + values[1];

  // ✅ safe percentage
  const completedPercentage = this.safePercentage(values[0], total);

  // ✅ center text (FIXED)
  const center = document.getElementById('expenseGoalsPercentage');
  if (center) {
    center.innerHTML = `
      <div class="expense-percentage-value">
        ${total === 0 ? 'No Data' : completedPercentage + '%'}
      </div>
      <div class="expense-percentage-label">
        ${total === 0 ? 'No Goals' : 'Completed'}
      </div>
    `;
  }

  // ✅ chart
  const canvas = document.getElementById('expenseGoalsChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  this.expenseGoalsChart?.destroy();

  this.expenseGoalsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percent = total === 0 ? 0 : ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} (${percent}%)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });

  // ✅ legend
  const legend = document.getElementById('expenseGoalsLegend');

  if (legend) {
    legend.innerHTML = '';

    labels.forEach((label, i) => {

      const percent =
        total === 0
          ? 0
          : ((values[i] / total) * 100).toFixed(1);

      const item = document.createElement('div');
      item.className = 'expense-legend-item';
      item.style.borderLeftColor = colors[i];

      item.innerHTML = `
        <div class="expense-legend-color" style="background: ${colors[i]};"></div>
        <div class="expense-legend-text">${label}</div>
        <div class="expense-legend-value">
          ${total === 0 ? '-' : percent + '%'}
        </div>
      `;

      legend.appendChild(item);
    });

    // ✅ summary
    const totalEl = document.getElementById('expenseTotalGoals');
    const completedEl = document.getElementById('expenseCompletedGoals');

    if (totalEl) totalEl.textContent = String(total);
    if (completedEl) completedEl.textContent = String(values[0]);
  }
}

  private expenseLoadHometronics(hometronicsData: HometronicsData) {
    const labels = ['Electronics', 'Appliances', 'Furniture', 'Kitchen'];
    const values = [hometronicsData.electronics, hometronicsData.appliances, hometronicsData.furniture, hometronicsData.kitchen];
    const colors = this.expenseModuleColors.hometronics;

    const total = values.reduce((a, b) => a + b, 0);
    const maxIndex = values.indexOf(Math.max(...values));
    const mostCategoryPercentage = Math.round((values[maxIndex] / total) * 100);

    const center = document.getElementById('expenseHometronicsPercentage');
    if (center) {
      center.innerHTML = `
        <div class="expense-percentage-value">${mostCategoryPercentage}%</div>
        <div class="expense-percentage-label">${labels[maxIndex]}</div>
      `;
    }

    const canvas = document.getElementById('expenseHometronicsChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    this.expenseHometronicsChart?.destroy();

    this.expenseHometronicsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const percent = ((context.raw / total) * 100).toFixed(1);
                return `${context.label}: ${context.raw} products (${percent}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });

    const legend = document.getElementById('expenseHometronicsLegend');
    if (legend) {
      legend.innerHTML = '';

      labels.forEach((label, i) => {
        const percent = ((values[i] / total) * 100).toFixed(1);

        const item = document.createElement('div');
        item.className = 'expense-legend-item';
        item.style.borderLeftColor = colors[i];
        item.innerHTML = `
          <div class="expense-legend-color" style="background: ${colors[i]};"></div>
          <div class="expense-legend-text">${label}</div>
          <div class="expense-legend-value">${percent}%</div>
        `;
        legend.appendChild(item);
      });

      document.getElementById('expenseTotalProducts')!.textContent = String(total);
      document.getElementById('expenseMostCategory')!.textContent = labels[maxIndex];
    }
  }

  // ======================================
  // ✅ Helpers
  // ======================================
  private expenseCalculateTransactionPercentage(values: number[]) {
    const maxUsage = Math.max(...values);

    let weightedSum = 0;
    let weightTotal = 0;

    values.forEach((value) => {
      const weight = value === maxUsage ? 2 : 1;
      const percentage = (value / maxUsage) * 100;
      weightedSum += percentage * weight;
      weightTotal += weight;
    });

    return Math.round(weightedSum / weightTotal);
  }

  private expenseFormatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  private expenseInitDatePickerDefaults() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const startEl = document.getElementById('expenseStartDate') as HTMLInputElement | null;
    const endEl = document.getElementById('expenseEndDate') as HTMLInputElement | null;

    if (startEl) startEl.value = yesterdayStr;
    if (endEl) endEl.value = today;
  }

  // ======================================
  // ✅ Expose global functions for onclick="..."
  // ======================================
  private exposeExpenseWindowFns(): void {
    const w = window as any;

    w.expenseChangeFilter = (filter: ExpenseFilter) => this.expenseChangeFilter(filter, w.event as Event);
    w.expenseToggleCustomDate = () => this.expenseToggleCustomDate(w.event as Event);
    w.expenseApplyCustomDate = () => this.expenseApplyCustomDate();
    w.expenseChangeModule = (module: ExpenseModule) => this.expenseChangeModule(module, w.event as Event);
    w.expenseRefreshData = () => this.expenseRefreshData(w.event as Event);
  }

formatModuleName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

private formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
private initModuleUsageChart(): void {
  if (!this.moduleUsageCanvas?.nativeElement?.offsetHeight) {
  return;
}

  if (!this.trackingData?.length) return;

  const ctx = this.moduleUsageCanvas.nativeElement.getContext('2d');
  if (!ctx) return;

  this.moduleUsageChart?.destroy();

  // ✅ map API data
  const labels = this.trackingData.map(item =>
    this.formatModuleName(item.moduleName)
  );

  const values = this.trackingData.map(item => item.totalSeconds);

  this.moduleUsageChart = new Chart(ctx, {
    type: 'bar',

    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: 'rgba(59,130,246,0.5)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },

 options: {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: { display: false },

    // ✅ Tooltip (when hover)
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return this.formatSeconds(context.raw);
        }
      }
    }
  },

  scales: {
    y: {
      ticks: {
        callback: (value: any) => {
          return this.formatSeconds(value);
        }
      }
    }
  }
}
  });

}

private getTransactionDataFromAPI(): TransactionData {

  if (!this.transectionscount || this.transectionscount.length === 0) {
    return { sms: 0, whatsapp: 0, manual: 0, ai: 0, excel: 0 };
  }

  let sms = 0;
  let whatsapp = 0;
  let manual = 0;
  let ai = 0;
  let excel = 0;

  this.transectionscount.forEach(item => {

    const path = (item.transactionPath || '').toLowerCase();

    switch (path) {

      case 'bankmessageread':
        sms += item.count;
        break;

      case 'bankmessage':
      case 'whatsappmassage':
        whatsapp += item.count;
        break;

      case 'apptransaction':
        manual += item.count;
        break;

      case 'imageprocessdata':
        ai += item.count;
        break;

      case 'exceldata':
        excel += item.count;
        break;

      default:
        manual += item.count; // fallback
        break;
    }
  });

  return { sms, whatsapp, manual, ai, excel };
}

private convertToPercentage(data: TransactionData): TransactionData {
  const total = data.sms + data.whatsapp + data.manual + data.ai + data.excel;

  if (total === 0) return data;

  return {
    sms: Math.round((data.sms / total) * 100),
    whatsapp: Math.round((data.whatsapp / total) * 100),
    manual: Math.round((data.manual / total) * 100),
    ai: Math.round((data.ai / total) * 100),
    excel: Math.round((data.excel / total) * 100)
  };
}

private getBudgetFromAPI(): BudgetItem[] {

  if (!this.categoryBreakdown || this.categoryBreakdown.length === 0) {
    return [];
  }

  return this.categoryBreakdown.map(item => ({
    name: item.name,
    spent: item.spent || 0,
    budget: item.limit || 0,
    color: item.colorCode || '#8B5CF6'
  }));
}
 

private getAccountsFromAPI() {

  if (!this.passbookData?.length) {
    return {
      passbook: { count: 0, usage: 0 },
      insurance: { count: 0, usage: 0 },
      wallet: { count: 0, usage: 0 },
      bank: { count: 0, usage: 0 },
      credit: { count: 0, usage: 0 }
    };
  }

  const grouped: any = {
  passbook: { value: 0, count: 0 },
  insurance: { value: 0, count: 0 },
  wallet: { value: 0, count: 0 },
  bank: { value: 0, count: 0 },
  credit: { value: 0, count: 0 }
};

this.passbookData
  .filter(item => item != null) // 🔥 remove null/undefined
  .forEach((item: any) => {

    if (Array.isArray(item)) {
      item
        .filter(sub => sub != null)
        .forEach((sub: any) => this.processAccount(sub, grouped));
    } else {
      this.processAccount(item, grouped);
    }

  });

  // ✅ convert to percentage
 const total = Object.values(grouped)
  .reduce((sum: number, item: any) => sum + item.value, 0);

  Object.keys(grouped).forEach((key: any) => {
    grouped[key].usage = total
  ? Math.round((Number(grouped[key].value) / Number(total)) * 100)
  : 0;
  });

  return {
    passbook: { count: grouped.passbook.count, usage: grouped.passbook.usage },
    insurance: { count: grouped.insurance.count, usage: grouped.insurance.usage },
    wallet: { count: grouped.wallet.count, usage: grouped.wallet.usage },
    bank: { count: grouped.bank.count, usage: grouped.bank.usage },
    credit: { count: grouped.credit.count, usage: grouped.credit.usage }
  };
}

processAccount(item: any, grouped: any) {

  if (!item) return; // 🔥 prevent crash

  const type = (item.type || '').toLowerCase();
  const balance = Number(item.balance) || 0;

  if (type.includes('bank')) {
    grouped.bank.value += Math.abs(balance);
    grouped.bank.count++;
  } else if (type.includes('wallet')) {
    grouped.wallet.value += Math.abs(balance);
    grouped.wallet.count++;
  } else if (type.includes('credit')) {
    grouped.credit.value += Math.abs(balance);
    grouped.credit.count++;
  } else if (type.includes('insurance')) {
    grouped.insurance.value += Math.abs(balance);
    grouped.insurance.count++;
  } else {
    grouped.passbook.value += Math.abs(balance);
    grouped.passbook.count++;
  }
}
private getGoalsFromAPI(): GoalsData {

  if (!this.goaldashboard_data) {
    return { completed: 0, inProgress: 0 };
  }

  const completed = this.goaldashboard_data.completedGoals?.length || 0;
  const inProgress = this.goaldashboard_data.ongoingGoals?.length || 0;

  return {
    completed,
    inProgress
  };
}

private getDuesFromAPI(): DuesData {

  if (!this.dashboard_data) {
    return { toPay: 0, income: 0 };
  }

  return {
    toPay: Number(this.dashboard_data.debit) || 0,
    income: Number(this.dashboard_data.credit) || 0
  };
}

private initExpenseCategoriesFromAPI() {

  const canvas = this.expenseCategoriesCanvas?.nativeElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 🔥 IMPORTANT: destroy old chart
  if (this.expenseCategoriesChart) {
    this.expenseCategoriesChart.destroy();
  }

  const labels = this.categorySummary.map(c => c.category);
  const data = this.categorySummary.map(c => c.total);

  const colors = this.categorySummary.map(c =>
    c.CatecolorCode?.startsWith('#')
      ? c.CatecolorCode
      : '#' + c.CatecolorCode
  );

  this.expenseCategoriesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
       plugins: {
    legend: {
      display: false   
    }
  }
    }
  });

  // 🔥 FORCE resize after render
  setTimeout(() => {
    this.expenseCategoriesChart?.resize();
    this.expenseCategoriesChart?.update();
  }, 200);
}


private safePercentage(value: number, total: number): number {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}
}

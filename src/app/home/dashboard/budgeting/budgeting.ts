import { Component, AfterViewInit } from '@angular/core';
import { AdminControl } from "./admin-control/admin-control";
import { BudgetUsageOverview } from "./budget-usage-overview/budget-usage-overview";
import { CategoryInsights } from "./category-insights/category-insights";
import { UserEngagementMetrics } from "./user-engagement-metrics/user-engagement-metrics";
import { RealtimeTracking } from "./realtime-tracking/realtime-tracking";
import { PerformanceInsights } from "./performance-insights/performance-insights";

// Ensure Chart.js is available globally
declare const Chart: any;

@Component({
  selector: 'app-budgeting',
  imports: [
    AdminControl,
    BudgetUsageOverview,
    CategoryInsights,
    UserEngagementMetrics,
    RealtimeTracking,
    PerformanceInsights
  ],
  templateUrl: './budgeting.html',
  styleUrl: './budgeting.scss'
})
export class Budgeting implements AfterViewInit {

  ngAfterViewInit(): void {
    const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const el = (id: string) => document.getElementById(id);
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // === Sample master datasets ===
    const CATEGORIES = ['Food', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Education'];
    const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'];
    const USERS = ['Aarav', 'Aisha', 'Rohan', 'Isha', 'Kabir', 'Meera', 'Veer', 'Sara', 'Ishan', 'Anaya'];

    // === 1) Budget Usage Overview KPIs ===
    function hydrateKPIs() {
      const active = rand(140, 260);
      const newToday = rand(8, 36);
      const newWeek = newToday + rand(60, 160);
      const newMonth = newWeek + rand(180, 520);
      const total = rand(6000, 13000);
      const completed = rand(2500, 5200);
      const exceeded = rand(1400, 3400);
      const rate = Math.round((completed / (completed + exceeded)) * 100);

      el('kpi-active-users')!.textContent = active.toLocaleString('en-IN');
      el('kpi-new-today')!.textContent = newToday.toLocaleString('en-IN');
      el('kpi-new-week')!.textContent = newWeek.toLocaleString('en-IN');
      el('kpi-new-month')!.textContent = newMonth.toLocaleString('en-IN');
      el('kpi-total-budgets')!.textContent = total.toLocaleString('en-IN');
      el('kpi-completed')!.textContent = completed.toLocaleString('en-IN');
      el('kpi-exceeded')!.textContent = exceeded.toLocaleString('en-IN');
      el('kpi-complete-rate')!.textContent = rate + '% success';

      const success = el('kpi-success-rate');
      if (success) success.textContent = rate + '%';
    }
    hydrateKPIs();

    // === 2) Charts: helper ===
    function mkChart(id: string, cfg: any) {
      const ctx = document.getElementById(id) as HTMLCanvasElement | null;
      if (!ctx) return;
      return new Chart(ctx, cfg);
    }

    // Budgets created this month (30 days)
    const days = Array.from({ length: 30 }, (_, i) => String(i + 1));
    const budgetsSeries = days.map(() => rand(28, 160));
    mkChart('budgetsCreatedChart', {
      type: 'line',
      data: { labels: days, datasets: [{ label: 'Budgets Created', data: budgetsSeries, fill: true, tension: .35 }] },
      options: { plugins: { legend: { display: false } } }
    });

    // Popular categories
    const popCounts = CATEGORIES.map(() => rand(240, 1400));
    mkChart('popularCategoriesChart', {
      type: 'bar',
      data: { labels: CATEGORIES, datasets: [{ label: 'Count', data: popCounts }] },
      options: { plugins: { legend: { display: false } }, scales: { x: { ticks: { autoSkip: false } } } }
    });

    // Avg amount per category
    const avgAmounts = CATEGORIES.map(() => rand(2500, 22000));
    mkChart('avgPerCategoryChart', {
      type: 'bar',
      data: { labels: CATEGORIES, datasets: [{ label: 'Avg Amount (₹)', data: avgAmounts }] },
      options: { plugins: { legend: { display: false } } }
    });

    // Category performance
    const achieved = CATEGORIES.map(() => rand(55, 84));
    const exceededPct = achieved.map(v => 100 - v);
    mkChart('categoryPerformanceChart', {
      type: 'bar',
      data: {
        labels: CATEGORIES,
        datasets: [
          { label: 'Achieved %', data: achieved },
          { label: 'Exceeded %', data: exceededPct }
        ]
      },
      options: { scales: { x: { stacked: true }, y: { stacked: true, max: 100 } } }
    });

    // === 3) User Engagement ===
    function tickLive() {
      const n = rand(7, 48);
      const eln = el('kpi-live-tracking');
      if (eln) eln.textContent = String(n);
    }
    tickLive();
    setInterval(tickLive, 5000);

    // Top users list
    const topUsers = USERS.slice(0, 7).map(name => ({ name, count: rand(5, 22) })).sort((a, b) => b.count - a.count);
    const topList = document.getElementById('top-users-list');
    if (topList) {
      topUsers.forEach((u, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="label"><i class="bi bi-person-badge"></i> ${i + 1}. <strong>${u.name}</strong></span><span class="count">${u.count}</span>`;
        topList.appendChild(li);
      });
    }

    // Spenders vs Savers
    mkChart('spendersSaversChart', {
      type: 'doughnut',
      data: { labels: ['High Spenders', 'Savers'], datasets: [{ data: [rand(40, 60), rand(40, 60)] }] },
      options: { plugins: { legend: { position: 'bottom' } } }
    });

    // === 4) Performance Insights ===
    mkChart('statusStackedChart', {
      type: 'bar',
      data: {
        labels: CATEGORIES.slice(0, 6),
        datasets: [
          { label: 'Under', data: Array.from({ length: 6 }, () => rand(20, 60)) },
          { label: 'Near (80–99%)', data: Array.from({ length: 6 }, () => rand(15, 45)) },
          { label: 'Exceeded (100%+)', data: Array.from({ length: 6 }, () => rand(10, 35)) }
        ]
      },
      options: { scales: { x: { stacked: true }, y: { stacked: true } } }
    });

    // === 5) Real-time feed ===
    const feed = document.getElementById('live-feed');
    function pushFeed() {
      if (!feed) return;
      const user = USERS[rand(0, USERS.length - 1)];
      const cat = CATEGORIES[rand(0, CATEGORIES.length - 1)];
      const amt = rand(700, 30000);
      const li = document.createElement('li');
      li.innerHTML = `<span class="label"><i class="bi bi-plus-circle me-1"></i><strong>${user}</strong> created a <strong>${cat}</strong> budget</span><span class="amount">${INR.format(amt)}</span>`;
      feed.prepend(li);
      while (feed.children.length > 8) feed.removeChild(feed.lastChild!);
    }
    for (let i = 0; i < 5; i++) pushFeed();
    setInterval(pushFeed, 4000);

    // Geo usage
    mkChart('geoChart', {
      type: 'pie',
      data: { labels: CITIES, datasets: [{ data: CITIES.map(() => rand(120, 720)) }] }
    });

    // Time of day radar
    const TOD = ['6–9', '9–12', '12–15', '15–18', '18–21', '21–24'];
    mkChart('timeOfDayChart', {
      type: 'radar',
      data: { labels: TOD, datasets: [{ label: 'Updates', data: TOD.map(() => rand(22, 130)) }] },
      options: { plugins: { legend: { display: false } } }
    });

    // === 6) Admin Controls ===
    const days15 = Array.from({ length: 15 }, (_, i) => String(i + 1));
    const cmp = mkChart('compareChart', {
      type: 'line',
      data: {
        labels: days15,
        datasets: [
          { label: 'A', data: days15.map(() => rand(25, 130)), tension: .35 },
          { label: 'B', data: days15.map(() => rand(25, 130)), tension: .35 }
        ]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });

    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn && cmp) {
      compareBtn.addEventListener('click', () => {
        cmp.data.datasets.forEach((ds: any) => ds.data = ds.data.map(() => rand(25, 130)));
        cmp.update();
      });
    }

    const exl = document.getElementById('export-excel');
    if (exl) exl.addEventListener('click', () => alert('Excel exported (demo sample data).'));

    const pdf = document.getElementById('export-pdf');
    if (pdf) pdf.addEventListener('click', () => alert('PDF exported (demo sample data).'));

    // Time filter badges
    document.querySelectorAll<HTMLElement>('[data-range]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll<HTMLElement>('[data-range]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterEl = document.getElementById('kpi-total-filter');
        if (filterEl) filterEl.textContent = `(${btn.dataset['range']![0].toUpperCase() + btn.dataset['range']!.slice(1)})`;
      });
    });
  }
}

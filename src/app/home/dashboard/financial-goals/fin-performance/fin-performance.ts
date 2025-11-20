import { Component } from '@angular/core';

interface User {
  id: string | number;
  name: string;
}

interface Goal {
  id: string | number;
  userId: string | number;
  title: string;
  status: 'completed' | 'abandoned' | 'in-progress';
  progress: number;
  category: string;
  updated: Date;
}

declare const charts: any; // external chart references

@Component({
  selector: 'app-fin-performance',
  templateUrl: './fin-performance.html',
  styleUrls: ['./fin-performance.scss']
})
export class FinPerformance {
  users: User[] = []; // should be populated externally

  // Helper for DOM access
  $(id: string): HTMLElement {
    return document.getElementById(id)!;
  }

  updatePerformanceCharts(data: { goals: Goal[] }): void {
    // --- Overall Success Rate (Gauge) ---
    const completed = data.goals.filter(g => g.status === 'completed').length;
    const abandoned = data.goals.filter(g => g.status === 'abandoned').length;
    const denom = completed + abandoned;
    const successRate = denom ? Math.round((completed / denom) * 100) : 0;

    charts.successGauge.data.datasets[0].data = [successRate, 100 - successRate];
    charts.successGauge.update();
    this.$('gaugeCenter').textContent = `${successRate}%`;

    // --- Almost There list (80–99% progress, in-progress) ---
    const almostThere = data.goals
      .filter(g => g.progress >= 80 && g.progress < 100 && g.status === 'in-progress')
      .slice(0, 7);

    this.$('listAlmost').innerHTML = almostThere
      .map(g => {
        const u = this.users.find(u => u.id === g.userId);
        return `<li>${u?.name || 'Unknown'}: ${g.title} (${g.progress}%)</li>`;
      })
      .join('');

    // --- Completed list (top 7) ---
    const completedGoals = data.goals.filter(g => g.status === 'completed').slice(0, 7);
    this.$('listCompleted').innerHTML = completedGoals
      .map(g => {
        const u = this.users.find(u => u.id === g.userId);
        return `<li class="fw-semibold">${u?.name || 'Unknown'}: ${g.title}</li>`;
      })
      .join('');

    // --- Inactive & Abandoned table ---
    const threshold = parseInt((this.$('inactiveDays') as HTMLInputElement).value) || 30;
    const inactive = data.goals.filter(g => {
      if (g.status === 'abandoned') return true;
      const days = Math.ceil((Date.now() - g.updated.getTime()) / 86400000);
      return g.status === 'in-progress' && days >= threshold;
    });

    this.$('tblInactive').innerHTML = inactive
      .map(g => {
        const u = this.users.find(u => u.id === g.userId);
        const daysInactive = Math.ceil((Date.now() - g.updated.getTime()) / 86400000);
        return `<tr>
                  <td>${u?.name || 'Unknown'}</td>
                  <td>${g.title}</td>
                  <td>${g.category}</td>
                  <td>${g.updated.toLocaleDateString()}</td>
                  <td class="text-end">${daysInactive}</td>
                </tr>`;
      })
      .join('');
  }
}

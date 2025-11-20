import { Component } from '@angular/core';


interface User {
  id: number;
  name: string;
  country: string;
  platform: string;
  segment: 'new' | 'returning';
}

interface Goal {
  id: number;
  userId: number;
  category: string;
  status: 'completed' | 'abandoned' | 'in-progress';
}

declare const charts: any; // external chart object reference

@Component({
  selector: 'app-fin-user-engagement',
  templateUrl: './fin-user-engagement.html',
  styleUrls: ['./fin-user-engagement.scss']
})
export class FinUserEngagement {
  users: User[] = []; // populate externally or via service

  // Helper to access DOM
  $(id: string): HTMLElement {
    return document.getElementById(id)!;
  }

  updateEngagementCharts(data: { goals: Goal[] }): void {
    // Build stats for each user
    const userStats: Record<number, { name: string; completed: number; total: number }> =
      Object.fromEntries(this.users.map(u => [u.id, { name: u.name, completed: 0, total: 0 }]));

    data.goals.forEach(g => {
      userStats[g.userId].total++;
      if (g.status === 'completed') {
        userStats[g.userId].completed++;
      }
    });

    // --- Top Achievers Table (Top 5 by completed goals) ---
    const achievers = Object.values(userStats)
      .filter(u => u.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 5);

    this.$('tblAchievers').innerHTML = achievers
      .map(u =>
        `<tr>
           <td>${u.name}</td>
           <td class="text-end">${u.completed.toLocaleString('en-IN')}</td>
           <td class="text-end">${u.total ? Math.round((u.completed / u.total) * 100) : 0}%</td>
         </tr>`
      )
      .join('');

    // --- Achievers vs Droppers vs Others ---
    const achieverCount = Object.values(userStats).filter(u => u.completed > 0).length;
    const dropperCount = Object.values(userStats).filter(u => u.total > 0 && u.completed === 0).length;
    const otherCount = this.users.length - achieverCount - dropperCount;

    charts.achieverSplit.data.datasets[0].data = [achieverCount, dropperCount, otherCount];
    charts.achieverSplit.update();

    // --- Retention Chart (placeholder, dynamic cohort logic can be added later) ---
  }
}

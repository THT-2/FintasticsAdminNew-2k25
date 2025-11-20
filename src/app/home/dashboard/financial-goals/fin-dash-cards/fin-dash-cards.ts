import { Component } from '@angular/core';
import { Filter } from '../../filter/filter';


interface Goal {
  id: number;
  status: 'completed' | 'abandoned' | 'in-progress';
  // other properties as needed
}

interface GoalEvent {
  ts: Date;
  userId: number;
  info?: string;
}

@Component({
  selector: 'app-fin-dash-cards',
  templateUrl: './fin-dash-cards.html',
  styleUrls: ['./fin-dash-cards.scss'],
  imports: [Filter]
})
export class FinDashCards {
  state = { range: 'Today' }; // make sure state is defined

  // Tiny helper like your original $
  $(id: string): HTMLElement {
    return document.getElementById(id)!;
  }

  updateKPIs(data: { goals: Goal[]; events: GoalEvent[] }): void {
    // Live Users (events in last 60s)
    const liveUsers = new Set<number>();
    const recentEvents = data.events.filter(e => Date.now() - e.ts.getTime() < 60000);
    recentEvents.forEach(e => liveUsers.add(e.userId));
    this.$('kpiLiveUsers').textContent = liveUsers.size.toString();

    // Goals Created
    const created = data.goals.length;
    this.$('kpiGoalsCreated').textContent = created.toLocaleString('en-IN');
    this.$('kpiGoalsCreatedSub').textContent = this.state.range;

    // Goals Completed
    const completed = data.goals.filter(g => g.status === 'completed').length;
    this.$('kpiGoalsCompleted').textContent = completed.toLocaleString('en-IN');

    // Active vs Abandoned
    const active = data.goals.filter(g => g.status === 'in-progress').length;
    const abandoned = data.goals.filter(g => g.status === 'abandoned').length;
    this.$('kpiActiveAbandoned').textContent = `${active.toLocaleString('en-IN')} / ${abandoned.toLocaleString('en-IN')}`;
  }
}

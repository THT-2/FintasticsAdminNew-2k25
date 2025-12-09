import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ChallengeFilterPayload {
  filter_type: 'Today' | 'Yesterday' | 'Thisweek' | 'Lastweek' | 'ThisMonth';
  status: 'all' | 'active' | 'completed' | 'cancelled';
  type: 'all' | 'iOS' | 'Android';
}

@Component({
  selector: 'app-challenge-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './challenge-filter.html',
  styleUrl: './challenge-filter.scss',
})
export class ChallengeFilter {
  filters: ChallengeFilterPayload = {
    filter_type: 'Today',
    status: 'active',
    type: 'all',
  };

  @Output() filtersChange = new EventEmitter<ChallengeFilterPayload>();

  onApplyFilters() {
    const body: ChallengeFilterPayload = {
      filter_type: this.filters.filter_type,
      status: this.filters.status === 'all' ? 'active' : this.filters.status,
      type: this.filters.type === 'all' ? 'Android' : this.filters.type,
    };

    this.filtersChange.emit(body);
  }
}

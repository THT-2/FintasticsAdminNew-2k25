import { Component } from '@angular/core';
import { PerformanceCards } from './performance-cards/performance-cards';
import { ChatTrends } from './chat-trends/chat-trends';
import { PerformanceDetails } from './performance-details/performance-details';

@Component({
  selector: 'app-performance-history',
  imports: [ChatTrends,PerformanceCards,PerformanceDetails],
  templateUrl: './performance-history.html',
  styleUrl: './performance-history.scss'
})
export class PerformanceHistory {

}

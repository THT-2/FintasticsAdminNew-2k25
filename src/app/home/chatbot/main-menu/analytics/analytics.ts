import { Component } from '@angular/core';
import { ChartsNdTrends } from './charts-nd-trends/charts-nd-trends';
import { SupportAnalytics } from './support-analytics/support-analytics';
import { TopPerformers } from './top-performers/top-performers';
import { TopicAnalytics } from './topic-analytics/topic-analytics';
import { Filter } from '../filter/filter';

@Component({
  selector: 'app-analytics',
  imports: [ChartsNdTrends,SupportAnalytics,TopPerformers,TopicAnalytics],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics {

}

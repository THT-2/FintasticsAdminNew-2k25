import { Component } from '@angular/core';
import { StatsCards } from "./stats-cards/stats-cards";
import { AnalysisGraph } from "./analysis-graph/analysis-graph";
import { UsersAndRecommendations } from "./users-and-recommendations/users-and-recommendations";

@Component({
  selector: 'app-analytics-dashboard',
  imports: [StatsCards, AnalysisGraph, UsersAndRecommendations],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.scss'
})
export class AnalyticsDashboard {

}

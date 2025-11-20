import { Component } from '@angular/core';
import { FinDashCards } from "./fin-dash-cards/fin-dash-cards";
import { FinCategory } from "./fin-category/fin-category";
import { FinUserEngagement } from "./fin-user-engagement/fin-user-engagement";
import { FinPerformance } from "./fin-performance/fin-performance";
import { FinRealtime } from "./fin-realtime/fin-realtime";
import { FinAdmin } from "./fin-admin/fin-admin";

@Component({
  selector: 'app-financial-goals',
  imports: [FinDashCards, FinUserEngagement, FinPerformance, FinRealtime, FinAdmin],
  templateUrl: './financial-goals.html',
  styleUrl: './financial-goals.scss'
})
export class FinancialGoals {

}

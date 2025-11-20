import { Component } from '@angular/core';
import { Insights } from "./insights/insights";
import { ByPlan } from "./by-plan/by-plan";
import { ByPlatform } from "./by-platform/by-platform";

@Component({
  selector: 'app-revenue-insights',
  imports: [Insights, ByPlan, ByPlatform],
  templateUrl: './revenue-insights.html',
  styleUrl: './revenue-insights.scss'
})
export class RevenueInsights {

}

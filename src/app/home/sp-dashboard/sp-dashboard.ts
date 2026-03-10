import { Component } from '@angular/core';
import { SpRevenueGraphs } from "./sp-revenue-graphs/sp-revenue-graphs";
import { SpRecentOrdertable } from "./sp-recent-ordertable/sp-recent-ordertable";
import { SpOverviewcards } from './sp-overviewcards/sp-overviewcards';

@Component({
  selector: 'app-sp-dashboard',
  imports: [SpOverviewcards, SpRevenueGraphs, SpRecentOrdertable],
  templateUrl: './sp-dashboard.html',
  styleUrl: './sp-dashboard.scss'
})
export class SpDashboard {

}

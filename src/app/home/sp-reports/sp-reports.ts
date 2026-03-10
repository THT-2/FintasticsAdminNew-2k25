import { Component } from '@angular/core';
import { ReportCards } from "./report-cards/report-cards";
import { ReportGraphs } from "./report-graphs/report-graphs";
import { ReportTopselling } from "./report-topselling/report-topselling";
import { ReportAbandonedcart } from "./report-abandonedcart/report-abandonedcart";

@Component({
  selector: 'app-sp-reports',
  imports: [ReportCards, ReportGraphs, ReportTopselling, ReportAbandonedcart],
  templateUrl: './sp-reports.html',
  styleUrl: './sp-reports.scss'
})
export class SpReports {

}

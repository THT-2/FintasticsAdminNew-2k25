import { Component, OnInit } from '@angular/core';
import { Filter } from "../../filter/filter";

@Component({
  selector: 'app-fin-dash',
  templateUrl: './fin-dash.html',
  styleUrls: ['./fin-dash.scss'],
  imports: [Filter]
})
export class FinDash implements OnInit {

  // Dashboard stats
  activeUsers: number = 0;
  waitingChats: number = 0;
  ongoingChats: number = 0;
  droppedChats: number = 0;
  resolvedToday: number = 0;
  satisfactionRate: number = 0;

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // Mock data for now (replace with API later)
    this.activeUsers = 23;
    this.waitingChats = 16;
    this.ongoingChats = 12;
    this.droppedChats = 5;
    this.resolvedToday = 42;
    this.satisfactionRate = 92;
  }
}

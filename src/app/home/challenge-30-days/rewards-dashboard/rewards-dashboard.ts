import { Component } from '@angular/core';
import { StatCards } from "./stat-cards/stat-cards";
import { RewardsCard } from "./rewards-card/rewards-card";

@Component({
  selector: 'app-rewards-dashboard',
  imports: [StatCards, RewardsCard],
  templateUrl: './rewards-dashboard.html',
  styleUrl: './rewards-dashboard.scss'
})
export class RewardsDashboard {

}

import { Component } from '@angular/core';
import { ChallengeFilter } from "./challenge-filter/challenge-filter";
import { StatCards } from "./stat-cards/stat-cards";
import { ParticipantOverview } from "./participant-overview/participant-overview";
import { ExpectedWinners } from "./expected-winners/expected-winners";

@Component({
  selector: 'app-challenge-dashboard',
  imports: [ChallengeFilter, StatCards, ParticipantOverview, ExpectedWinners],
  templateUrl: './challenge-dashboard.html',
  styleUrl: './challenge-dashboard.scss'
})
export class ChallengeDashboard {

}

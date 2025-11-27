import { Component } from '@angular/core';
import { ParticipantCards } from "./participant-cards/participant-cards";
import { ParticipantsList } from "./participants-list/participants-list";

@Component({
  selector: 'app-participants-dashboard',
  imports: [ParticipantCards, ParticipantsList],
  templateUrl: './participants-dashboard.html',
  styleUrl: './participants-dashboard.scss'
})
export class ParticipantsDashboard {

}

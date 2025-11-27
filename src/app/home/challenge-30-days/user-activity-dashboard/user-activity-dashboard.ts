import { Component } from '@angular/core';
import { UserCards } from "./user-cards/user-cards";
import { MonthlyCalender } from "./monthly-calender/monthly-calender";
import { WeekCalender } from "./week-calender/week-calender";
import { PreviousChallengeHistory } from "./previous-challenge-history/previous-challenge-history";

@Component({
  selector: 'app-user-activity-dashboard',
  imports: [UserCards, MonthlyCalender, WeekCalender, PreviousChallengeHistory],
  templateUrl: './user-activity-dashboard.html',
  styleUrl: './user-activity-dashboard.scss'
})
export class UserActivityDashboard {

}

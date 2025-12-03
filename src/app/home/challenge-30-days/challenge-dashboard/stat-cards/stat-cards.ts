import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ChallengeFilter, ChallengeFilterPayload } from "../challenge-filter/challenge-filter";
import { Data } from '../../../../Service/data';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Alert } from 'bootstrap';
import { AlertService } from '../../../../constants/alertservice';

@Component({
  selector: 'app-stat-cards',
  imports: [ChallengeFilter],
  templateUrl: './stat-cards.html',
  styleUrl: './stat-cards.scss',
  providers:[AlertService]
})
export class StatCards {
  public apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.challenge_dashboard;
  dashboardData: any;
  challenge:any=null;


  constructor(private navservice: Data, private cd: ChangeDetectorRef, private alertService:AlertService) {}

  ngOnInit() {
    this.loadDashboard({
      filter_type: 'Thisweek',
      status: 'active',
      type: 'Android',
    });
  }

  onFiltersChanged(filters: ChallengeFilterPayload) {
    this.loadDashboard(filters);
  }

   getChallengeData(){
    this.navservice.postData(this.apiUrl,{}).subscribe({
    next: (res: any) => {
      console.log("challenge",res);
      if (res.code === 200) {
        this.challenge = res.chat_dashboard;
        console.log('challengedata', this.challenge);
      } else {
        this.alertService.toast("error", true, res.message);
      }
      this.cd.detectChanges();
    },
    error: (error: any) => {
      this.alertService.toast("error", true, error);
    }
  });
  }


  private loadDashboard(filters: ChallengeFilterPayload) {
  const body = {
    filter_type: filters.filter_type,
    status: filters.status,
    type: filters.type,
  };

  this.navservice.postData(this.apiUrl, body).subscribe({
    next: (res: any) => {
      console.log('dashboard response', res);
      if (res.code === 200) {
        this.challenge = res.chat_dashboard;   
      } else {
        this.alertService.toast('error', true, res.message);
      }
      this.cd.detectChanges();
    },
    error: (err) => {
      console.error('Failed to load dashboard data', err);
      this.alertService.toast('error', true, err);
    },
  });
}

}

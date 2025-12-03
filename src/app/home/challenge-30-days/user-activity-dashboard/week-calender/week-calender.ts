import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { Data } from '../../../../Service/data';
import { AlertService } from '../../../../constants/alertservice';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-week-calender',
  imports: [DatePipe,CommonModule],
  templateUrl: './week-calender.html',
  styleUrl: './week-calender.scss',
  providers:[AlertService]
})
export class WeekCalender {


    days: any[] = [];

  constructor(
    private navservice: Data,
    private cd: ChangeDetectorRef,
    private alertService: AlertService
  ) {


    effect(() => {
      const id = this.navservice.selectedUserId();
      if (id) {
        this.getcalender(id);
      }
    });
  }

  getcalender(id: string){
    const apiUrl = ApiRoutesConstants.BASE_URL + ApiRoutesConstants.participantdata + "/" + id;

    this.navservice.getData(apiUrl).subscribe({
      next: (res: any) => {
        console.log("day",res);
        if (res.code === 200) {
          this.days = res.result.currentweek.days;
          console.log('weekdays', this.days);
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
}

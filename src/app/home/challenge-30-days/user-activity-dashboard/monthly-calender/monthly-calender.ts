import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { ApiRoutesConstants } from '../../../../constants/api-route-constants';
import { Data } from '../../../../Service/data';
import { AlertService } from '../../../../constants/alertservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-calender',
  imports: [CommonModule],
  templateUrl: './monthly-calender.html',
  styleUrl: './monthly-calender.scss',
  providers:[AlertService]
})
export class MonthlyCalender {


    calender: any[] = [];

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
        console.log("cal",res);
        if (res.code === 200) {
          this.calender = res.result.dailyStats;
          console.log('calend', this.calender);
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
